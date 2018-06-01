const Markov = require('markov-strings')

const impersonate = (data) => {
  const markov = new Markov(data)
  markov.buildCorpusSync()
  return markov.generateSentenceSync().string
}
module.exports.impersonate = impersonate
