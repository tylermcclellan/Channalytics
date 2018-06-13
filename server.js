//Startup and Dependencies
console.log("Loading in!!")
const dotenv = require('dotenv').config()
const passport = require('passport')
const SlackStrategy = require('@aoberoi/passport-slack').default.Strategy
const express = require('express')
const path = require('path')
const app = express()
const slack = require('./local/slack')
const crypto = require('./local/crypto')

//Globals
const PORT = process.env.PORT || 5000
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const token = process.env.ACCESS_TOKEN

//Slack Authentication Setup
passport.use(new SlackStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  callbackURL: 'http://localhost:5000/auth/slack/callback'
}, (accessToken, scopes, team, {bot, incomingWebhook}, profile, done) => {
  done(null, profile.user)
}))
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(passport.initialize())

//Middleware
const asyncRun = async (req, res, next) => {
  req.data = await slack.getUserObject(token, req.uid)
  next()
}

const asyncChannels = async (req, res, next) => {
  req.data = await slack.getChannelNames(token, req.uid)
  next()
}

const decrypt = (req, res, next) => {
  req.uid = crypto.decrypt(req.params.uid)
  next()
}

//Routes
app.use(express.static(path.join(__dirname, 'client/build')))

//OAuth callback url
app.get('/auth/slack/callback',
  passport.authorize('slack', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('http://localhost:3000/#/dashboard/?' + crypto.encrypt(req.account.id))
  }
)

app.get('/api/run/:uid', decrypt, asyncRun, (req, res) => {
  console.log("Returning users")
  res.send(req.data)
})

app.get('/api/channels/:uid', decrypt, asyncChannels, (req, res) => {
  console.log("Returning channels")
  res.send(req.data)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

