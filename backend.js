console.log("Loading in!!")
const { WebClient} = require('@slack/client')

//get tokens
const verifyToken = process.env.SLACK_TOKEN
console.log(`Token: ${verifyToken}`)
const clientID = process.env.SLACK_CLIENT_ID
console.log(`Client ID: ${clientID}`)
const clientSecret = process.env.SLACK_CLIENT_SECRET
console.log(`Client Secret: ${clientSecret}`)
let totalMessages = 0
let totalWords = {}

//Helper functions
const findChannel = channel => i => {
  return i.name === channel
}
const filterUsers = selectedChannel => i => {
  return !i.is_bot &&
  i.real_name !== undefined && 
  selectedChannel.members.includes(i.id)
}
const filterMessages = () => {
  return /<.*>|[^A-Za-z]|\bbe\b|\bfor\b|\bwith\b|\bhas\b|\bthe\b|\ba\b|\bi\b|\bI\b|\bon\b|\bto\b|\byou\b|\band\b|\bive\b|\bof\b|\bwhat\b|\bit\b|\bthat\b|\bthis\b|\bis\b|\bhe\b|\bher\b|\bshe\b|\bhe\b|\bin\b|\bwas\b/g
}
const filterEmpty = i => i !== '' && !i.includes('http') && i.length > 1

const channelSelection = 'random'

//create web client
const createWebClient = verificationToken => {
  const web = new WebClient(verifyToken)
  console.log("Created new WebClient")
  return web
}

//Setup and Helpers ^^^^
//////////////////////////////////////////////////////////////

//Selects channel identified above ^^
const getSelectedChannel = async (web, channel='general') => {
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
  const userObject = filteredUsers.reduce((accumulator, currentValue) => {
    accumulator[currentValue.id] = currentValue
    accumulator[currentValue.id].words = {}
    accumulator[currentValue.id].numMessages = 0
    accumulator[currentValue.id].numWords = 0
    accumulator[currentValue.id].uniqueWords = []
    return accumulator
  }, {})
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
const readConversation = async (web, u, limit=1000) => {
  const channel = await getSelectedChannel(web)
  const conversationID = channel.id
  const channelConvo = await web.conversations.history({ 
    channel: conversationID,
    limit: limit
  })
  channelConvo.messages.forEach( message => {
    if (message.type === 'message' && u[message.user] !== undefined) {
      //console.log(u[message.user].real_name + ": " + message.text)
      let words = cleanMessage(message)
      u[message.user].numMessages += 1
      totalMessages += 1
      words.forEach( word => {
        if (u[message.user].words[word] === undefined) {
          u[message.user].words[word] = 1
        } else {
          u[message.user].words[word] += 1
        }
        if (totalWords[word] === undefined) {
          totalWords[word] = 1
        } else {
          totalWords[word] += 1
        }
        u[message.user].numWords += 1
      })
    }
  })
  console.log("Total Words: " + Object.keys(totalWords).length)
  console.log("Total Messages: " + totalMessages)
  return u
}

const uniqueness = (word, user) => {
  const unique = 
    (Math.pow(user.words[word], 2)/totalWords[word])*(totalMessages/user.numMessages)
  return unique
}

const analyze = (u) => {
  const users = Object.keys(u)
  //loop for each user
  users.forEach( user => {
    const userWords = Object.keys(u[user].words)
    let uniqueValues = []
    //loop for each word
    userWords.forEach( word => {
      const unique = uniqueness(word, u[user], totalWords, totalMessages)
      //if uniqueWords array isn't full
      if (u[user].uniqueWords.length < 5) {
        u[user].uniqueWords.push(word)
        uniqueValues.push(unique)
      //uniqueWords is full, so replace min in unique words and unique values arrays
      } else if (unique > Math.min(...uniqueValues)) {
        u[user].uniqueWords[uniqueValues.findIndex(index => {
          return index === Math.min(...uniqueValues)})] = word
        uniqueValues[uniqueValues.findIndex(index => {
          return index === Math.min(...uniqueValues)})] = unique
      }
    })
  })
}

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}

const displayResults = u => {
    console.log("\nRESULTS\n")
    Object.keys(u).forEach( user => {
      console.log("--" + u[user].real_name + "--")
      console.log("Messages: " + u[user].numMessages)
      console.log("Words: " + u[user].numWords)
      console.log("Avg Msg Length: " + 
        round(u[user].numWords/u[user].numMessages, 2) + " words")
      console.log("% of Total Messages: " + 
        round(u[user].numMessages/totalMessages*100, 2) + "%")
      console.log("Unique Words: " + u[user].uniqueWords + "\n")
    })
}

const run = async (verificationToken, channel) => {
  try {
    const web = createWebClient(verificationToken)
    let u = await createUserObject(web, channel)
    u  = await readConversation(web, u)
    await analyze(u)
    displayResults(u)
    return u
  } catch(e) {
    console.log(e)
  }
}



let u = run(verifyToken, channelSelection)
