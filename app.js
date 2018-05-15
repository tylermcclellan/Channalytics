console.log("Loading in!!")
const { WebClient} = require('@slack/client')

//get tokens
const verifyToken = process.env.SLACK_TOKEN
console.log(`Token: ${verifyToken}`)
const clientID = process.env.SLACK_CLIENT_ID
console.log(`Client ID: ${clientID}`)
const clientSecret = process.env.SLACK_CLIENT_SECRET
console.log(`Client Secret: ${clientSecret}`)

//Helper functions
const findChannel = i => i.name === channelSelection
const filterUsers = i => {
  !i.is_bot &&
  i.real_name !== undefined && 
  selectedChannel.members.includes(i.id)
}


//create web client
const web = new WebClient(verifyToken)
console.log("Created new WebClient")
const channelSelection = 'hax'

const userMaster = async () => {
  try {
    console.log("In async function")
    const u = await createUserObject(web)
    console.log("Printing user object to console")
    console.log(u["Tyler McClellan"])
    return u
  } catch(e) {
    console.log("ahhhh, got an error dude")
  }
}

let u = userMaster()

const createUserObject(web) = async () => {
  //get channels
  const channels = await web.channels.list() 
  const selectedChannel = channels.find(findChannel)
  //console.log(channel)
  const userList = await web.users.list()
  userList.members.filter(filterUsers)
  const obj = userList.reduce((accumulator, currentValue) => {
    accumulator[currentValue.real_name] = currentValue
    //console.log(accumulator)
    return accumulator
  }, {})
  return obj
}

/*
 * 1. Get tokens
 * 2. Create Web Client
 * 3. Get selected channel
 * 4. Get all users
 * 5. Filter out users not in channel
 * 6. Combine user objects into shared object so they can be referred to by key
 *
 */
