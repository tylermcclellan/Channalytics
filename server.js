//Startup and Dependencies
console.log("Loading in!!")
const dotenv = require('dotenv').config(),
  passport = require('passport'),
  SlackStrategy = require('passport-slack-oauth2').Strategy,
  express = require('express'),
  app = express(),
  slack = require('./slack')
//Constant Globals
const PORT = process.env.PORT || 5000
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
let accessCode = ''

//Slack Authentication Setup
passport.use(new SlackStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  console.log('Access Token: ' + accessToken)
  accessCode = accessToken
  done(null, profile)
  }
))
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(passport.initialize())

const asyncRun = async (req, res, next) => {
  const u = await slack.run(process.env.SLACK_TOKEN, req.params.channelName)
  req.data = u
  next()
}

const asyncChannels = async (req, res, next) => {
  const channels = await slack.getChannels(process.env.SLACK_TOKEN)
  req.data = channels
  next()
}

//path to start OAuth flow
app.get('/auth/slack/', passport.authorize('Slack'))

//OAuth callback url
app.get('/auth/slack/callback',
  passport.authorize('Slack', { failureRedirect: '/login' }),
  async (req, res) => {
    console.log('successfully reached callback function')
    //console.log(res)
    res.json(req.user)
  })

app.get('/api/run/:channelName', asyncRun,  (req, res) => {
  console.log("Returning user object")
  res.send(req.data)
})

app.get('/api/channels/', asyncChannels, (req, res) => {
  console.log("Returning channel object")
  res.send(req.data)
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))
