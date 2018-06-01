//Startup and Dependencies
console.log("Loading in!!")
const dotenv = require('dotenv').config()
const passport = require('passport')
const SlackStrategy = require('passport-slack-oauth2').Strategy
const express = require('express')
const path = require('path')
const app = express()
const slack = require('./local/slack')
const crypto = require('./local/crypto')

//Globals
const PORT = process.env.PORT || 5001
const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET
const token = process.env.ACCESS_TOKEN

//Slack Authentication Setup
passport.use(new SlackStrategy({
  clientID: CLIENT_ID,
  clientSecret: CLIENT_SECRET
}, (accessToken, refreshToken, profile, done) => {
  done(null, profile)
}))
app.use(require('body-parser').urlencoded({ extended: true }))
app.use(passport.initialize())

//Middleware
const asyncRun = async (req, res, next) => {
  const  u = await slack.getUserObject(token, req.uid)
  req.data = u
  next()
}

const asyncChannels = async (req, res, next) => {
  const channels = await slack.getChannelNames(token, req.uid)
  req.data = channels
  next()
}

const decrypt = (req, res, next) => {
  const encrypted = req.params.uid
  const decrypted = crypto.decrypt(encrypted)
  req.uid = decrypted
  next()
}

//Routes
app.use(express.static(path.join(__dirname, 'client/build')))

//OAuth callback url
app.get('/auth/slack/callback',
  passport.authorize('Slack', { failureRedirect: '/login' }),
  (req, res) => {
    authed = true
    const uid = crypto.encrypt(req.account.id)
    res.redirect('http://localhost:3000/#/dashboard/?' + uid)
  }
)

app.get('/api/run/:uid', decrypt, asyncRun, (req, res) => {
  console.log("Returning user object")
  res.send(req.data)
})

app.get('/api/channels/:uid', decrypt, asyncChannels, (req, res) => {
  console.log("Returning channel object")
  res.send(req.data)
})

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname+'/client/build/index.html'));
})

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

