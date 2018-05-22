import React from 'react'

class ChannelItem extends React.Component {
  render() {
    return (
      <p 
        key={this.props.channel} 
        onClick={this.props.handleClick}
        className='ChannelListItem'>
          {this.props.channel}
      </p> 
    )
  }
}

export default ChannelItem
