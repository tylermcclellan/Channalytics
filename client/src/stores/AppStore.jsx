import React from 'react'
import UserItem from '../components/UserItem'
import { observable, computed, action, decorate } from 'mobx'
const POS = require('pos')
const _ = require('lodash')

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}

class AppStore {
  currentChannel = 'general'
  users = {}
  channelList = []
  loaded = false
  sorter = 'name'
  userName = null
  chatbox = []

  async getUsers(uid){
    try {
      const response = await fetch(`/api/run/${uid}/`)
      const body = await response.json()
      if (response.status !== 200) throw Error(body.message)
      return body
    } catch(e) {
      console.log('STORE: Error getting users')
      console.log(e)
    }
  }

  async getChannels(uid){
    try {
      const response = await fetch(`/api/channels/${uid}`)
      const body = await response.json()
      if (response.status !== 200) throw Error(body.message)
      return body
    } catch(e) {
      console.log('STORE: Error getting channels')
      console.log(e)
    }
  }

  async initStore(uid){
    this.users = await this.getUsers(uid)
    this.channelList = await this.getChannels(uid)
    this.loaded = true
  }
  setCurrentChannel(channel){
    this.currentChannel = channel
  }
  setSorter(sorter){
    if (this.sorter !== sorter) this.sorter = sorter
  }
  setUserName(userName){
    this.userName = userName
  }
  get chart(){
    if (this.users !== {}) {
      const userKeys = Object.keys(this.users.channels[this.currentChannel].users)
      const chartArrs = {
        names: userKeys.map(user=> this.users.channels[this.currentChannel].users[user].real_name),
        numbers: userKeys.map(user=> this.users.channels[this.currentChannel].users[user].numMessages)
      }
      return chartArrs
    }
  }
  get globalUsers(){
    if (this.users !== {}) return this.users.users
  }
  get currentUsers(){
    if (this.users !== {}) return this.users.channels[this.currentChannel].users
  }
  get numUsers(){
    if (this.users !== {}) return Object.keys(this.users.channels[this.currentChannel].users).length
  }
  get messages(){
    if (this.users !== {}) return this.users.channels[this.currentChannel].totalMessages
  }
  get wordCount(){
    if (this.users !== {}) return this.users.channels[this.currentChannel].totalWordCount
  }
  get avgLength(){
    if (this.users !== {}) return round(this.users.channels[this.currentChannel].totalWordCount
      /this.users.channels[this.currentChannel].totalMessages, 2)
  }
  get avgSentiment(){
    if (this.users !== {}) return round(this.users.channels[this.currentChannel].sentiment
      /this.users.channels[this.currentChannel].totalMessages, 2)
  }
  get personality(){
    if (this.users !== {}) return this.users.insights
  }
  get userList(){
    if (this.users !== {}) {
      const userList = Object.keys(this.users.channels[this.currentChannel].users)
      const mappedList = userList.map( u => {
        const user = this.users.channels[this.currentChannel].users[u]
        const messageDump = this.users.users[u].messageDump
        const source = user.profile.image_48.replace(`\\`, ``)
        const name = user.real_name
        const percent = round(user.numMessages/this.users.channels[this.currentChannel].totalMessages*100, 2)
        const messages = user.numMessages
        const numWords = user.numWords
        const unique = user.uniqueWords.map( 
          word => word !== user.uniqueWords[user.uniqueWords.length-1] ? `${word}, ` : `${word}`
        )
        const sentiment = round(user.sentiment/messages, 4)
        
        return <UserItem 
          key={user.id}
          id={user.id}
          img={source}
          name={name}
          messageDump={messageDump}
          percent={percent}
          messages={messages}
          words={user.words}
          numWords={numWords}
          unique={unique} 
          sentiment={sentiment}/>
        })
      const list = _.sortBy(mappedList, [item => item.props[this.sorter]])
      if (this.sorter !== 'name') return list.reverse()
      return list
    }
  }
  participation(){
    let labels = []
    this.channelList.forEach(label => {
      if (this.users.channels[label].users[this.userName] !== undefined) 
        labels.push(label)
    })
    const values = labels.map(channel => {
      return this.users.channels[channel].users[this.userName].numMessages
    })
    return {
      labels: labels,
      values: values
    }
  }
  pos(){
    const taggedWords = new POS.Tagger()
      .tag(new POS.Lexer()
      .lex(this.users.users[this.userName].messageDump.join(' ')))
      .filter(phrase => phrase[1].match(/[A-Z]/))
    let counter = {}
    taggedWords.forEach(word => {
      counter[word[1]] = counter[word[1]] === undefined ? 1 : counter[word[1]] + 1
    })
    const labels = Object.keys(counter)
    const values = labels.map(word => {
      return counter[word]
    })
    return {
      labels: labels,
      values: values
    }
  }
  get userProfile(){
    if (this.userName !== null) {
      const profile = {
        user: this.users.users[this.userName],
        participation: this.participation(),
        pos: this.pos()
      }
      return profile
    }
  }
}

decorate(AppStore, {
  currentChannel: observable,
  users: observable,
  channelList: observable,
  loaded: observable,
  sorter: observable,
  userName: observable,
  chatbox: observable,
  initStore: action,
  setCurrentChannel: action,
  setSorter: action,
  setUserName: action,
  chart: computed,
  globalUsers: computed,
  currentUsers: computed,
  numUsers: computed,
  messages: computed,
  wordCount: computed,
  avgLength: computed,
  avgSentiment: computed,
  personality: computed,
  userList: computed,
  userProfile: computed
})

export default new AppStore()
