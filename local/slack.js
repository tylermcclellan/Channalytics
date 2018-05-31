const { WebClient } = require('@slack/client')
const sentiment = require('wink-sentiment')
const PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3')
const Markov = require('markov-strings')
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
const WATSON_USERNAME = process.env.WATSON_USERNAME
const WATSON_PASSWORD = process.env.WATSON_PASSWORD
const WATSON_URL = process.env.WATSON_URL

//Classes
////////////////////////////////////////////////////////////////////////////////////////////
class Channel {
  constructor() {
    this.totalMessages = 0
    this.totalWords = {}
    this.totalWordCount = 0
    this.name = ''
    this.id = ''
    this.sentiment = 0
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
    this.sentiment = 0
    this.uniqueWords = []
  }
}


//Getters
////////////////////////////////////////////////////////////////////////////////////////////
const getChannelNames = async (token, uid) => {
  try {
    const web = createWebClient(token)
    const list = await web.channels.list()
    const filteredList = list.channels.filter(channel => channel.members.includes(uid))
    const channelList = filteredList.map(channel => channel.name)
    return channelList
  } catch(e) {
    console.log(e)
  }
}
module.exports.getChannelNames = getChannelNames

//Returns a an array of channel objects
const getChannels = async (web, uid) => {
  try {
    const conversations = await web.channels.list()
    const channels = conversations.channels.filter(channel => channel.members.includes(uid))
    return channels
  } catch(e) {
    console.log(e)
  }
}
module.exports.getChannels = getChannels

//Helper functions
////////////////////////////////////////////////////////////////////////////////////////////
const findChannel = channel => i => {
  return i.name === channel
}
const filterMessages = () => {
  return /<.*>|:.*:|[^A-Za-z]|\bjust\b|\bhave\b|\blike\b|\bby\b|\bthats\b|\bbut\b|\bwould\b|\bhim\b|\bwe\b|\bare\b|\bbe\b|\bfor\b|\bwith\b|\bhas\b|\bthe\b|\ba\b|\bi\b|\bI\b|\bon\b|\bto\b|\byou\b|\band\b|\bive\b|\bof\b|\bwhat\b|\bit\b|\bthat\b|\bthis\b|\bis\b|\bhe\b|\bher\b|\bshe\b|\bhe\b|\bin\b|\bwas\b|\bits\b|\bat\b|\bas\b|\ban\b|\bthey\b|\bare\b\bit\b|\byour\b|\bif\b|\bour\b/g
}
const filterEmpty = i => i !== '' && !i.includes('http') && i.length > 1

const filterUsers = i => i.real_name !== '' && !i.is_bot && !i.deleted

const reduceUsers = (accumulator, currentValue) => {
  accumulator[currentValue.id] = new User
  accumulator[currentValue.id].real_name = currentValue.real_name
  accumulator[currentValue.id].id = currentValue.id
  accumulator[currentValue.id].profile = currentValue.profile
  return accumulator
}

const reduceChannels = (accumulator, currentValue) => {
  accumulator[currentValue.name] = currentValue
  return accumulator
}

//Data Manipulation
////////////////////////////////////////////////////////////////////////////////////////////

//Creates web client
const createWebClient = verificationToken => {
  const web = new WebClient(verificationToken)
  return web
}

//Creates master user object
const createUserObject = async (web, uid) => {
  try {
    const channels = await getChannels(web, uid)
    const userList = await web.users.list()
    const filteredUsers = userList.members.filter(filterUsers)
    let u = {
      channels: {},
      messageDump: '',
      insights: [],
      //this is Russ's ID (placeholder for testing)
      uid: 'U04QV5ULJ'
    }
    const channelArr = channels.map(channel => {
      let c = new Channel
      c.name = channel.name
      c.id = channel.id
      const users = filteredUsers.filter(user => channel.members.includes(user.id))
      c.users = users.reduce(reduceUsers, {})
      return c
    })
    u.channels = channelArr.reduce(reduceChannels, {})
    return u
  } catch(e) {
    console.log(e)
  }
}

//Removes stop words and mentions from message and puts message in lowercase
const cleanMessage = message => {
  let words = message.text.split(" ")
  words = words.map(item => {
    item = item.toLowerCase()
    return item.replace(filterMessages(), '')
  })
  words = words.filter(filterEmpty)
  return words
}

//async version of .forEach()
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

//returns up to the past 5000 messages from public Slack channel
const getMessages = async (web, id, limit) => {
  try {
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
  } catch(e) {
    console.log(e)
  }
}

//Reads through the messages in each channel and adds them to the user object
const readConversation = async (web, u, limit=1000) => { 
  const channels = Object.keys(u.channels)
  try {
    await asyncForEach(channels, async (channel) => {
      const id = u.channels[channel].id
      const channelConvo = await getMessages(web, id, limit)
      channelConvo.forEach( message => {
        if (message.type === 'message' && u.channels[channel].users[message.user] !== undefined) {
          if (message.user === u.uid && message.type === 'message') u.messageDump += '\n' + message.text
          const messageSentiment = sentiment(message.text).normalizedScore
          const words = cleanMessage(message)
          u.channels[channel].users[message.user].numMessages += 1
          u.channels[channel].users[message.user].sentiment += messageSentiment
          u.channels[channel].totalMessages += 1
          u.channels[channel].sentiment += messageSentiment
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
    const markov = new Markov(u.messageDump.replace(/<.*/g, '').split('\n'))
    markov.buildCorpusSync()
    const result = markov.generateSentenceSync()
    console.log(result.string)
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

const promisePersonality = (messages) => {
  return new Promise((resolve, reject) => {
    const personalityInsights = new PersonalityInsightsV3({
      username: WATSON_USERNAME,
      password: WATSON_PASSWORD,
      url: WATSON_URL,
      version: '2017-10-13'
    })
    
    personalityInsights.profile({
      content: messages,
      content_type: 'text/plain'
    },
      (err, response) => {
        if (err) {
          reject(err)
        } else {
          resolve(response.personality)
        }
      }
    )
  })
}

//Determines 5 most unique words and gets Watson personality insights
const analyze = async (u) => {
  try {
    const channels = Object.keys(u.channels)
    channels.forEach( channel => {
      const users = Object.keys(u.channels[channel].users)
      users.forEach( user => {
        const userWords = Object.keys(u.channels[channel].users[user].words)
        let uniqueValues = []
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
    u.insights = await promisePersonality(u.messageDump)
  } catch(e) {
    u.insights = undefined
    console.log(e)
  }
}

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}

//Main driving function
const run = async (token, uid) => {
  try {
    console.log(`${blue}Creating new Web Client${reset}`)
    const web = createWebClient(token)
    
    console.log(`${green}Creating User Object${reset}`)
    let userObject = await createUserObject(web, uid)
    
    console.log(`${yellow}Reading your conversations${reset}`)
    await readConversation(web, userObject, 1000)
    
    console.log(`${red}Analyzing your words${reset}`)
    await analyze(userObject)
    return userObject
  } catch(e) {
    console.log(e)
  }
}
module.exports.getUserObject = run

