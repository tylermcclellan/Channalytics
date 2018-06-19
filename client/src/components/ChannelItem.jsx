import React from 'react'

const ChannelItem = (props) => {
  return (
    <p 
      key={props.channel} 
      onClick={props.handleClick}
      className='ChannelListItem'>
        {props.channel}
    </p> 
  )
}

export default ChannelItem
