import React from 'react'
import Markov from 'markov-chains'
import { 
  Popover,
  OverlayTrigger,
  Image
} from 'react-bootstrap'

class Impression extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      show: false
    }

    this.handleClick = this.handleClick.bind(this)
  }
  
  handleClick = e => {
    const content = this.props.messageDump.length > 35 ? (
      new Markov(this.props.messageDump.map(string => {
        return string.split(' ')
      })).walk().join(' ')) : 'Not enough data'
    this.setState({ 
      target: e.target,
      content: content
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
          target={this.state.target}
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
