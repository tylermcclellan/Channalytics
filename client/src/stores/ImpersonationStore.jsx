import { observable, action, decorate } from 'mobx'
const Markov = require('markov')

class ImpersonationStore {
  content = null
  
  markov = (messageDump) => {
    let response
    if (messageDump.length > 35) {
      const m = Markov(2)
      const messages = messageDump.length > 1000 ? (
        messageDump.slice(0, 1000).join('\n')
      ):(
        messageDump.join('\n')
      )
      m.seed(messages)
      response = m.forward(m.pick(), 10).join(' ') + '...'
    } else {
      response = 'Not enough data.'
    }
    this.content = response
  }
}

decorate(ImpersonationStore, {
  content: observable,
  markov: action
})

export default new ImpersonationStore()