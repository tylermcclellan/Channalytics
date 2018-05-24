//Startup and Dependencies
console.log("Loading in!!")
const dotenv = require('dotenv').config(),
  passport = require('passport'),
  SlackStrategy = require('passport-slack-oauth2').Strategy,
  express = require('express'),
  app = express(),
  slack = require('./local/slack')

//Globals
const PORT = 5000
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
let accessCode = ''
let authed = false

//Slack Authentication Setup
passport.use(new SlackStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  console.log('Access Token: ' + accessToken)
  accessCode = accessToken
  //slack.init(accessToken)
  done(null, profile)
  }
))
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(passport.initialize())

//Middleware
const asyncRun = async (req, res, next) => {
  let u = undefined
  const initialized = slack.initialized()
  console.log('getting channel ' + req.params.channelName)
  if (initialized){
    u = await slack.getUserObject(req.params.channelName)
  } else {
    u = await slack.init(accessCode, req.params.channelName)
  }
  req.data = u
  next()
}

const asyncChannels = async (req, res, next) => {
  const channels = await slack.getChannelNames()
  req.data = channels
  next()
}

//Routes
//path to start OAuth flow
app.get('/auth/slack/', passport.authorize('Slack'))

//OAuth callback url
app.get('/auth/slack/callback',
  passport.authorize('Slack', { failureRedirect: '/login' }),
  (req, res) => {
    authed = true
    res.redirect('http://localhost:3000/#/dashboard')
  }
)

app.get('/#/dashboard', (req, res) => {
  res.end
})

app.get('/api/run/:channelName', asyncRun, (req, res) => {
  console.log("Returning user object")
  res.send(req.data)
})

app.get('/api/channels/', asyncChannels, (req, res) => {
  console.log("Returning channel object")
  res.send(req.data)
})

app.get('/api/authed/', (req, res) => {
  res.send(authed)
})

app.get('/api/client/', (req, res) => {
  res.send({ id: CLIENT_ID })
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
