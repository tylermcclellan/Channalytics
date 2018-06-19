import '../App.css'
import ChannelItem from './ChannelItem'
import React from 'react'
import { ListGroup } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'

const ChannelList = (props) => {
  const listNames = props.store.channelList.map( channel => 
    <ChannelItem 
      key={Math.random()} 
      channel={channel} 
      handleClick={props.handleClick}/>
  )
  return (
    <div className='ChannelList'>
      <h2 className='ChannelListTitle'>Channels</h2>
      <ListGroup>{listNames}</ListGroup>
    </div>
  )
}

export default inject('store')(observer(ChannelList))
