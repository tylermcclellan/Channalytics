import React from 'react'
import Markov from 'markov'
import { 
  Popover,
  OverlayTrigger,
  Image
} from 'react-bootstrap'

class Impression extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = { show: false }

    this.handleClick = this.handleClick.bind(this)
  }

  //Creates impression from Markov Chain
  handleClick = e => {
    let response
    if (this.props.messageDump.length > 35) {
      const m = Markov(2)
      const messages = this.props.messageDump.length > 2000 ? (
        this.props.messageDump.slice(0, 2000).join('\n')
      ):(
        this.props.messageDump.join('\n')
      )
      m.seed(messages)
      response = m.forward(m.pick(), 10).join(' ') + '...'
    } else {
      response = 'Not enough data.'
    }
    this.setState({ 
      content: response
    })
  }

  render() {
    const filler = (
      <Popover id={`id ${this.props.img}`} title='Impression'>
        {this.state.content}
      </Popover>
    )
    return (
      <span>
        <OverlayTrigger
          trigger='click'
          rootClose
          placement='left'
          overlay={filler}>
          <Image 
            src={this.props.img} 
            style={{cursor: 'pointer'}} 
            alt="img not found" 
            rounded
            onClick={this.handleClick}
          />
        </OverlayTrigger>
      </span>
    )
  }
}

export default Impression

