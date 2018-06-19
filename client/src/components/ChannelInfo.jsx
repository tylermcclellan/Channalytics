import React from 'react'
import { inject, observer } from 'mobx-react'

const ChannelInfo = ({store}) => {
  return (
    <div className='ChannelList'>
      <h3 className='ChannelListTitle'>CHANNEL INFO</h3>
      <h4>Total Messages: {store.messages}</h4>
      <h4>Total Words: {store.wordCount}</h4>
      <h4>Number of Users: {store.numUsers}</h4>
      <h4>Average Message Length: {store.avgLength} words</h4>
      <h4>*Average Message Sentiment: {store.avgSentiment}</h4>
    </div>
  )
}

export default inject('store')(observer(ChannelInfo))
