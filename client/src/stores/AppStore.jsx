import React from 'react'
import UserItem from '../components/UserItem'
import { observable, computed, action, decorate } from 'mobx'
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

  get chart(){
    if (this.users !== {}) {
      let chartArrs = {}
      const userKeys = Object.keys(this.users.channels[this.currentChannel].users)
      chartArrs.names = userKeys.map(user=> this.users.channels[this.currentChannel].users[user].real_name)
      chartArrs.numbers = userKeys.map(user=> this.users.channels[this.currentChannel].users[user].numMessages)
      return chartArrs
    }
  }
  initStore(params){
    this.users = params.users
    this.channelList = params.channelList
    this.loaded = params.loaded
  }
  setCurrentChannel(channel){
    this.currentChannel = channel
  }
  setSorter(sorter){
    if (this.sorter !== sorter) this.sorter = sorter
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
    if (this.users !== {}) return (this.users.channels[this.currentChannel].totalWordCount
      /this.users.channels[this.currentChannel].totalMessages)
  }
  get avgSentiment(){
    if (this.users !== {}) return (this.users.channels[this.currentChannel].sentiment
      /this.users.channels[this.currentChannel].totalMessages)
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
        const sentiment = round(user.sentiment/user.numMessages, 4)
        
        return <UserItem 
          key={u}
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
}

decorate(AppStore, {
  currentChannel: observable,
  users: observable,
  channelList: observable,
  loaded: observable,
  sorter: observable,
  initStore: action,
  setCurrentChannel: action,
  setSorter: action,
  chart: computed,
  globalUsers: computed,
  currentUsers: computed,
  numUsers: computed,
  messages: computed,
  wordCount: computed,
  avgLength: computed,
  avgSentiment: computed,
  personality: computed,
  userList: computed
})

export default new AppStore()
