import { observable, computed, decorate } from 'mobx'

class AppStore {
  currentChannel = 'general'
  users = {}
  channelList = []
  loaded = false

  chart = () => {
    if (this.users !== {}) {
      let chartArrs = {}
      const userKeys = Object.keys(this.users.channels[this.currentChannel].users)
      chartArrs.names = userKeys.map(user=> this.users.channels[this.currentChannel].users[user].real_name)
      chartArrs.numbers = userKeys.map(user=> this.users.channels[this.currentChannel].users[user].numMessages)
      return chartArrs
    }
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
}

decorate(AppStore, {
  currentChannel: observable,
  users: observable,
  channelList: observable,
  loaded: observable,
  chart: computed,
  currentUsers: computed,
  numUsers: computed,
  messages: computed,
  wordCount: computed,
  avgLength: computed,
  avgSentiment: computed,
  personality: computed
})

export default new AppStore()
