import React from 'react'
import { inject, observer } from 'mobx-react'

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}

const Watson = ({store}) => {
  return (
    <div className='ChannelList'>
      <h3 className='ChannelListTitle'>Your Big 5 Personality Traits</h3>
      <a href='https://www.ibm.com/watson/'>From IBM's Watson!</a>
      <p>Openness: {round(store.personality[0].percentile*100, 2)}%</p>
      <p>Concientiousness: {round(store.personality[1].percentile*100, 2)}%</p>
      <p>Extraversion: {round(store.personality[2].percentile*100, 2)}%</p>
      <p>Agreeableness: {round(store.personality[3].percentile*100, 2)}%</p>
      <p>Neuroticism: {round(store.personality[4].percentile*100, 2)}%</p>
    </div>
  )
}

export default inject('store')(observer(Watson))
