console.log("Loading in!!")
const { WebClient} = require('@slack/client')

//get tokens
const verifyToken = process.env.SLACK_TOKEN
console.log(`Token: ${verifyToken}`)
const clientID = process.env.SLACK_CLIENT_ID
console.log(`Client ID: ${clientID}`)
const clientSecret = process.env.SLACK_CLIENT_SECRET
console.log(`Client Secret: ${clientSecret}`)

const web = new WebClient(verifyToken)
console.log("Created new WebClient")
const channelSelection = 'hax'

web.channels.list() 
  .then((res) => {
    console.log(Array.isArray(res.channels))
    console.log(res.channels.find( i => i.name === channelSelection))
  })
  .catch(console.error)
