import React from 'react'

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}

class Watson extends React.Component {
  render() {
    return (
      <div className='ChannelList'>
        <h3 className='ChannelListTitle'>Your Big 5 Personality Traits</h3>
        <a href='https://www.ibm.com/watson/'>From IBM's Watson!</a>
        <p>Openness: {round(this.props.personality[0].percentile*100, 2)}%</p>
        <p>Concientiousness: {round(this.props.personality[1].percentile*100, 2)}%</p>
        <p>Extraversion: {round(this.props.personality[2].percentile*100, 2)}%</p>
        <p>Agreeableness: {round(this.props.personality[3].percentile*100, 2)}%</p>
        <p>Neuroticism: {round(this.props.personality[4].percentile*100, 2)}%</p>
      </div>
    )
  }
}

export default Watson
