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

//Helper functions
const findChannel = channel => i => {
  return i.name === channel
}
const filterUsers = selectedChannel => i => {
  return i.id !== 'USLACKBOT' && !i.is_bot &&
  i.real_name !== undefined && 
  selectedChannel.members.includes(i.id)
}
const filterMessages = () => {
  return /<.*>|[^A-Za-z]|\bbe\b|\bfor\b|\bwith\b|\bhas\b|\bthe\b|\ba\b|\bi\b|\bI\b|\bon\b|\bto\b|\byou\b|\band\b|\bive\b|\bof\b|\bwhat\b|\bit\b|\bthat\b|\bthis\b|\bis\b|\bhe\b|\bher\b|\bshe\b|\bhe\b|\bin\b|\bwas\b|\bits\b|\bat\b|\bas\b|\ban\b|\bthey\b|\bare\b\bit\b|\b/g
}
const filterEmpty = i => i !== '' && !i.includes('http') && i.length > 1

//create web client
const createWebClient = verificationToken => {
  const web = new WebClient(verificationToken)
  return web
}


const getChannels = async (verificationToken) => {
  const web = createWebClient(verificationToken)
  const rawResponse = await web.channels.list()
  const response = rawResponse.channels.filter(channel => !channel.is_archived)
  return response
}

  
const getSelectedChannel = async (web, channel) => {
  const response = await web.channels.list() 
  const selectedChannel = response.channels.find(findChannel(channel))
  return selectedChannel
}

//Creates master user object
const createUserObject = async (web, channel) => {
  //get channels
  const selectedChannel = await getSelectedChannel(web, channel)
  const userList = await web.users.list()
  const filteredUsers = userList.members.filter(filterUsers(selectedChannel))
  const userObject = { users: {} }
  userObject.users = filteredUsers.reduce((accumulator, currentValue) => {
    accumulator[currentValue.id] = currentValue
    accumulator[currentValue.id].words = {}
    accumulator[currentValue.id].numMessages = 0
    accumulator[currentValue.id].numWords = 0
    accumulator[currentValue.id].uniqueWords = []
    return accumulator
  }, {})
  userObject.totalWords = {}
  userObject.totalMessages = 0
  return userObject
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

//Reads through the messages in a channel,
//adds them to the user object, and returns
//the user object
const readConversation = async (web, u, limit=1000, channel) => {
  const selectedChannel = await getSelectedChannel(web, channel)
  const conversationID = selectedChannel.id
  const channelConvo = await web.conversations.history({ 
    channel: conversationID,
    limit: limit
  })
  channelConvo.messages.forEach( message => {
    if (message.type === 'message' && u.users[message.user] !== undefined) {
      let words = cleanMessage(message)
      u.users[message.user].numMessages += 1
      u.totalMessages += 1
      words.forEach( word => {
        if (u.users[message.user].words[word] === undefined) {
          u.users[message.user].words[word] = 1
        } else {
          u.users[message.user].words[word] += 1
        }
        if (u.totalWords[word] === undefined) {
          u.totalWords[word] = 1
        } else {
          u.totalWords[word] += 1
        }
        u.users[message.user].numWords += 1
      })
    }
  })
  console.log("Total Words: " + Object.keys(u.totalWords).length)
  console.log("Total Messages: " + u.totalMessages)
  return u
}

const uniqueness = (word, u, user) => {
  const unique = 
    (Math.pow(user.words[word], 2)/u.totalWords[word])*(u.totalMessages/user.numMessages)
  return unique
}

const analyze = (u) => {
  const users = Object.keys(u.users)
  //loop for each user
  users.forEach( user => {
    const userWords = Object.keys(u.users[user].words)
    let uniqueValues = []
    //loop for each word
    userWords.forEach( word => {
      const unique = uniqueness(word, u, u.users[user])
      //if uniqueWords array isn't full
      if (u.users[user].uniqueWords.length < 5) {
        u.users[user].uniqueWords.push(word)
        uniqueValues.push(unique)
      //uniqueWords is full, so replace min in unique words and unique values arrays
      } else {
        const min = Math.min(...uniqueValues)
        if (unique > min) {
          u.users[user].uniqueWords[uniqueValues.findIndex(index => {
            return index === min})] = word
          uniqueValues[uniqueValues.findIndex(index => {
            return index === min})] = unique
        }
      }
    })
  })
}

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}

const displayResults = u => {
  console.log("\nRESULTS\n")
  console.log("Total Words: " + Object.keys(u.totalWords).length)
  console.log("Total Messages: " + u.totalMessages)
  console.log("Number of Users: " + Object.keys(u).length)
  console.log("Average Message Length: " + Object.keys(u.totalWords).length/u.totalMessages)
  console.log()
  Object.keys(u).forEach( user => {
    console.log("--" + yellow + u.users[user].real_name + white + "--")
    console.log("Messages: " + u.users[user].numMessages)
    console.log("Words: " + u.users[user].numWords)
    console.log("Avg Msg Length: " +
      round(u.users[user].numWords/u.users[user].numMessages, 2) + " words")
    console.log("% of Total Messages: " + 
      round(u.users[user].numMessages/u.totalMessages*100, 2) + "%")
    console.log("Unique Words: " + u.users[user].uniqueWords + "\n")
    })
}

const run = async (verificationToken, channel='random') => {
  try {
    console.log(`${blue}Creating new Web Client${reset}`)
    const web = createWebClient(verificationToken)
    console.log(`${green}Creating User Object${reset}`)
    const userObject = await createUserObject(web, channel)
    console.log(`${yellow}Reading your conversations....${reset}`)
    const userRead = await readConversation(web, userObject, 1000, channel)
    console.log(`${red}Analyzing your WORDS!!!!!!${reset}`)
    console.log(`${bright}${underscore}SENDING RESULTS TO NSA!!!!${reset}`)
    await analyze(userRead)
    //displayResults(userRead)
    return userRead
  } catch(e) {
    console.log(e)
  }
}

module.exports.run = run
module.exports.getChannels = getChannels

