import React from 'react'
import ChannelList from './ChannelList'
import Watson from './Watson'
import ImpressionNotification from './ImpressionNotification'

class Sidebar extends React.Component {
  render() {
    return (
      <div>
        <ChannelList
          channels={this.props.channels}
          handleClick={this.props.handleClick}
        />
        {this.props.showPersonality ? <Watson personality={this.props.personality} /> : ''}
        <ImpressionNotification />
      </div>
    )
  }
}

export default Sidebar
