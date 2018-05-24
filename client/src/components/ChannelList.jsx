import React from 'react'
import { ListGroup } from 'react-bootstrap'
import ChannelItem from './ChannelItem'
import '../App.css'

class ChannelList extends React.Component {
  render() {
    const channelNames = this.props.channels
    const listNames = channelNames.map( channel => 
      <ChannelItem 
        key={channel} 
        channel={channel} 
        handleClick={this.props.handleClick}/>
      )
    return (
      <div className='ChannelList'>
        <h2 className='ChannelListTitle'>Channels</h2>
        <ListGroup>{listNames}</ListGroup>
      </div>
    )
  }
}

export default ChannelList
