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
let userObject = {}
let isLoading = false
let token = ''
let initialized = false

//Get functions
const getUserObject = (channel) => {
  console.log("Returning user object")
  while(1){
    if (!isLoading) return userObject.channels[channel]
  }
}
module.exports.getUserObject = getUserObject

const getChannelNames = () => {
  return Object.keys(userObject.channels)
}
module.exports.getChannelNames = getChannelNames

const isInitialized = () => {
  return initialized
}
module.exports.initialized = isInitialized

//Helper functions
const findChannel = channel => i => {
  return i.name === channel
}
const filterMessages = () => {
  return /<.*>|[^A-Za-z]|\bbe\b|\bfor\b|\bwith\b|\bhas\b|\bthe\b|\ba\b|\bi\b|\bI\b|\bon\b|\bto\b|\byou\b|\band\b|\bive\b|\bof\b|\bwhat\b|\bit\b|\bthat\b|\bthis\b|\bis\b|\bhe\b|\bher\b|\bshe\b|\bhe\b|\bin\b|\bwas\b|\bits\b|\bat\b|\bas\b|\ban\b|\bthey\b|\bare\b\bit\b/g
}
const filterEmpty = i => i !== '' && !i.includes('http') && i.length > 1

//Data Manipulation
//Create web client
const createWebClient = verificationToken => {
  const web = new WebClient(verificationToken)
  return web
}

//Returns a an array of channel objects
const getChannels = async (web) => {
  const conversations = await web.users.conversations()
  const channels = conversations.channels
  const upgradedChannels = await Promise.all(channels.map( async (channel) => {
    const response = await web.conversations.members({ channel: channel.id })
    channel.members = response.members
    return channel
  }))
  return upgradedChannels
}
module.exports.getChannels = getChannels

//Returns a selected channel object
const getSelectedChannel = async (web, channel) => {
  const response = await getChannels(web)
  const selectedChannel = response.find(findChannel(channel))
  return selectedChannel
}

//Creates master user object
const createUserObject = async (web) => {
  //get and filter user and channel list
  const channels = await getChannels(web)
  const userList = await web.users.list()
  const filteredUsers = userList.members.filter(user => user.real_name !== '' && !user.is_bot && !user.deleted)
  //create new user object
  let u = { channels: {} }
  //each channel will have a name, users object, totalWords, and totalMessages
  const channelArr = channels.map(channel => {
    let c = {}
    c.name = channel.name
    c.id = channel.id
    //filter user list to only those within the current channel
    const users = filteredUsers.filter(user => channel.members.includes(user.id))
    //change user list into object referrable by user id
    c.users = users.reduce((accumulator, currentValue) => {
      accumulator[currentValue.id] = currentValue
      accumulator[currentValue.id].words = {}
      accumulator[currentValue.id].numMessages = 0
      accumulator[currentValue.id].numWords = 0
      accumulator[currentValue.id].uniqueWords = []
      return accumulator
    }, {})
    c.totalWords = {}
    c.totalMessages = 0
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

//Reads through the messages in each channel,
//adds them to the user object, and returns
//the user object
const readConversation = async (web, u, limit=1000) => { 
  const channels = Object.keys(u.channels)
  //loop for each channel
  try {
    await asyncForEach(channels, async (channel) => {
      const id = u.channels[channel].id
      const channelConvo = await web.conversations.history({ 
        channel: id,
        limit: limit
      })
      //loop for each message in each channel
      channelConvo.messages.forEach( message => {
        if (message !== undefined && message.type === 'message' && u.channels[channel].users[message.user] !== undefined) {
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
          })

        }
      })
    })
  } catch(e) {
    console.log(e)
  }
}

const uniqueness = (word, u, user, channel) => {
  const thisChannel = u.channels[channel]
  const thisUser = thisChannel.users[user]
  const unique = 
    (Math.pow(thisUser.words[word], 2)/thisChannel.totalWords[word])*(thisChannel.totalMessages/thisChannel.numMessages)
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


const run = async () => {
  try {
    console.log(`${blue}Creating new Web Client${reset}`)
    const web = createWebClient(token)
    
    console.log(`${green}Creating User Object${reset}`)
    let userObject = await createUserObject(web)
    
    console.log(`${yellow}Reading your conversations${reset}`)
    await readConversation(web, userObject, 1000)
    
    console.log(`${red}Analyzing your words${reset}`)
    analyze(userObject)
    return userObject
  } catch(e) {
    console.log(e)
  }
}

const init = async (verificationToken, channel) => {
  try {
    token = verificationToken
    isLoading = true
    console.log('in init')
    userObject = await run()
    isLoading = false
    initialized = true
    return userObject.channels[channel]
  } catch(e) {
    console.log(e)
  }
}

module.exports.init = init

setInterval(async () => {
  isLoading = true
  userObject = await run()
  isLoading = false
  console.log('done updating')
}, 600000)

