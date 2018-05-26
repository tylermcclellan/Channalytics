const { WebClient } = require('@slack/client')
const black = "\x1b[30m"
const red = "\x1b[31m"
const green = "\x1b[32m"
const yellow = "\x1b[33m"
const blue = "\x1b[34m"
const magenta = "\x1b[35m"
const cyan = "\x1b[36m"
const white = "\x1b[37m"
const reset = "\x1b[0m"
const bright = "\x1b[1m"
const dim = "\x1b[2m"
const underscore = "\x1b[4m"
const blink = "\x1b[5m"
const reverse = "\x1b[7m"
const hidden = "\x1b[8m"

//Classes
////////////////////////////////////////////////////////////////////////////////////////////
class Channel {
  constructor() {
    this.totalMessages = 0
    this.totalWords = {}
    this.totalWordCount = 0
    this.name = ''
    this.id = ''
    this.users = {}
  }
}

class User {
  constructor() {
    this.id = ''
    this.real_name = ''
    this.words = {}
    this.profile = {}
    this.numMessages = 0
    this.numWords = 0
    this.uniqueWords = []
  }
}


//Getters
////////////////////////////////////////////////////////////////////////////////////////////
const getChannelNames = async (token, uid) => {
  const web = createWebClient(token)
  const list = await web.channels.list()
  const filteredList = list.channels.filter(channel => channel.members.includes(uid))
  const channelList = filteredList.map(channel => channel.name)
  return channelList
}
module.exports.getChannelNames = getChannelNames

const isInitialized = () => {
  return initialized
}
module.exports.initialized = isInitialized

//Returns a an array of channel objects
const getChannels = async (web, uid) => {
  const conversations = await web.channels.list()
  const channels = conversations.channels.filter(channel => channel.members.includes(uid))
  return channels
}
module.exports.getChannels = getChannels

//Helper functions
////////////////////////////////////////////////////////////////////////////////////////////
const findChannel = channel => i => {
  return i.name === channel
}
const filterMessages = () => {
  return /<.*>|:.*:|[^A-Za-z]|\bbe\b|\bfor\b|\bwith\b|\bhas\b|\bthe\b|\ba\b|\bi\b|\bI\b|\bon\b|\bto\b|\byou\b|\band\b|\bive\b|\bof\b|\bwhat\b|\bit\b|\bthat\b|\bthis\b|\bis\b|\bhe\b|\bher\b|\bshe\b|\bhe\b|\bin\b|\bwas\b|\bits\b|\bat\b|\bas\b|\ban\b|\bthey\b|\bare\b\bit\b|\byour\b|\bif\b|\bour\b/g
}
const filterEmpty = i => i !== '' && !i.includes('http') && i.length > 1

const filterUsers = i => i.real_name !== '' && !i.is_bot && !i.deleted

//Data Manipulation
////////////////////////////////////////////////////////////////////////////////////////////

//Create web client
const createWebClient = verificationToken => {
  const web = new WebClient(verificationToken)
  return web
}

//Creates master user object
const createUserObject = async (web, uid) => {
  //get and filter user and channel list
  const channels = await getChannels(web, uid)
  const userList = await web.users.list()
  const filteredUsers = userList.members.filter(filterUsers)
  //create new user object
  let u = { channels: {} }
  //each channel will have a name, users object, totalWords, and totalMessages
  const channelArr = channels.map(channel => {
    let c = new Channel
    c.name = channel.name
    c.id = channel.id
    //filter user list to only those within the current channel
    const users = filteredUsers.filter(user => channel.members.includes(user.id))
    //change user list into object referrable by user id
    c.users = users.reduce((accumulator, currentValue) => {
      accumulator[currentValue.id] = new User
      accumulator[currentValue.id].real_name = currentValue.real_name
      accumulator[currentValue.id].id = currentValue.id
      accumulator[currentValue.id].profile = currentValue.profile
      return accumulator
    }, {})
    return c
  })
  //reduce channel array into object referrable by channel name
  u.channels = channelArr.reduce((accumulator, currentValue) => {
    accumulator[currentValue.name] = currentValue
    return accumulator
  }, {})
  return u
}

const cleanMessage = message => {
  //const noStops = message.removeStopWords()
  let words = message.text.split(" ")
  words = words.map(item => {
    item = item.toLowerCase()
    return item.replace(filterMessages(), '')
  })
  words = words.filter(filterEmpty)
  return words
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const getMessages = async (web, id, limit) => {
  const initial = await web.conversations.history({
    channel: id,
    limit: limit
  })
  let hasMore = initial.has_more
  let messages = [...initial.messages]
  let cursor = ''
  if (initial.response_metadata !== undefined) cursor = initial.response_metadata.next_cursor
  let count = 1
  while(hasMore && count < 5) {
    response = await web.conversations.history({
      channel: id,
      cursor: cursor,
      limit: limit
    })
    messages = messages.concat(response.messages)
    if (response.response_metadata !== undefined) cursor = response.response_metadata.next_cursor
    hasMore = response.has_more
    count++
  }
  return messages
}

//Reads through the messages in each channel and adds them to the user object
const readConversation = async (web, u, limit=1000) => { 
  const channels = Object.keys(u.channels)
  //loop for each channel
  try {
    await asyncForEach(channels, async (channel) => {
      const id = u.channels[channel].id
      const channelConvo = await getMessages(web, id, limit)
      //loop for each message in each channel
      channelConvo.forEach( message => {
        if (message.type === 'message' && u.channels[channel].users[message.user] !== undefined) {
          const words = cleanMessage(message)
          u.channels[channel].users[message.user].numMessages += 1
          u.channels[channel].totalMessages += 1
          //loop for each word in each message in each channel
          words.forEach( word => {
            if (u.channels[channel].users[message.user].words[word] === undefined) {
              u.channels[channel].users[message.user].words[word] = 1
            } else {
              u.channels[channel].users[message.user].words[word] += 1
            }
            if (u.channels[channel].totalWords[word] === undefined) {
              u.channels[channel].totalWords[word] = 1
            } else {
              u.channels[channel].totalWords[word] += 1
            }
            u.channels[channel].users[message.user].numWords += 1
            u.channels[channel].totalWordCount += 1
          })

        }
      })
    })
  } catch(e) {
    console.log(e)
  }
}

const uniqueness = (word, u, user, channel) => {
  const unique = 
    (Math.pow(u.channels[channel].users[user].words[word], 2)/u.channels[channel].totalWords[word])*
    (u.channels[channel].totalMessages/u.channels[channel].users[user].numMessages)
  return unique
}

const analyze = (u) => {
  try {
    const channels = Object.keys(u.channels)
    //loop for each channel
    channels.forEach(channel => {
      const users = Object.keys(u.channels[channel].users)

      //loop for each user of each channel
      users.forEach( user => {
        const userWords = Object.keys(u.channels[channel].users[user].words)
        let uniqueValues = []
      
        //loop for each word of each user of each channel
        userWords.forEach( word => {
          const unique = uniqueness(word, u, user, channel)
          if (u.channels[channel].users[user].uniqueWords.length < 5) {
            u.channels[channel].users[user].uniqueWords.push(word)
            uniqueValues.push(unique)
          } else {
            const min = Math.min(...uniqueValues)
            if (unique > min) {
              u.channels[channel].users[user].uniqueWords[uniqueValues.findIndex(index => {
                return index === min})] = word
              uniqueValues[uniqueValues.findIndex(index => {
                return index === min})] = unique
            }
          }
        })
    
      })
  
    })
  } catch(e) {
    console.log(e)
  }
}

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}


const run = async (token, uid) => {
  try {
    console.log(`${blue}Creating new Web Client${reset}`)
    const web = createWebClient(token)
    
    console.log(`${green}Creating User Object${reset}`)
    let userObject = await createUserObject(web, uid)
    
    console.log(`${yellow}Reading your conversations${reset}`)
    await readConversation(web, userObject, 1000)
    
    console.log(`${red}Analyzing your words${reset}`)
    analyze(userObject)
    return userObject
  } catch(e) {
    console.log(e)
  }
}
module.exports.getUserObject = run
