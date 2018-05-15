console.log("Loading in!!")
const { WebClient} = require('@slack/client')

//get tokens
const verifyToken = process.env.SLACK_TOKEN
console.log(`Token: ${verifyToken}`)
const clientID = process.env.SLACK_CLIENT_ID
console.log(`Client ID: ${clientID}`)
const clientSecret = process.env.SLACK_CLIENT_SECRET
console.log(`Client Secret: ${clientSecret}`)

//create web client
const web = new WebClient(verifyToken)
console.log("Created new WebClient")
const channelSelection = 'general'

//get channels
web.channels.list() 
  .then((res) => {
    //find channels selection
    return res.channels.find( i => i.name === channelSelection)
  })
  .catch(console.error)
  .then(channel => {
    //got selected channel, get list of users
    console.log(channel)
    return web.users.list()
      .then(users => {
        //got list of users, filter for wanted users
        return users.members.filter(
          i => !i.is_bot &&
          i.real_name !== undefined && 
          channel.members.includes(i.id)
        )
      })
      .catch(console.error)
  })
  .catch(console.error)
  .then(users => {
    //create object from all users
    return users.reduce((accumulator, currentValue) => {
      accumulator[currentValue.real_name] = currentValue
      console.log(accumulator)
    }, {})
  })
  .catch(console.error)



/*
 * 1. Get tokens
 * 2. Create Web Client
 * 3. Get selected channel
 * 4. Get all users
 * 5. Filter out users not in channel
 * 6. Combine user objects into shared object so they can be referred to by key
 *
 */
