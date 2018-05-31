import React from 'react'

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}


class ChannelInfo extends React.Component {
  render() {
    return (
      <div>
        <h3>CHANNEL INFO</h3>
        <h4>Total Messages: {this.props.messages}</h4>
        <h4>Total Words: {this.props.words}</h4>
        <h4>Number of Users: {this.props.users}</h4>
        <h4>Average Message Length: {round(this.props.avgLength, 2)} words</h4>
        <h4>*Average Message Sentiment: {round(this.props.avgSentiment, 2)}</h4>
      </div>
    )
  }
}

export default ChannelInfo
