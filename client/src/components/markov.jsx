import Markov from 'markov'

const markov = (messageDump) => {
  let response
  if (messageDump.length > 35) {
    const m = Markov(2)
    const messages = messageDump.length > 1500 ? (
      messageDump.slice(0, 2000).join('\n')
    ):(
      messageDump.join('\n')
    )
    m.seed(messages)
    response = m.forward(m.pick(), 10).join(' ') + '...'
  } else {
    response = 'Not enough data.'
  }
  return response
}

export default markov