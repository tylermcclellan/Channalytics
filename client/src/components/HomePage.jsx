import React from 'react'
import { Jumbotron } from 'react-bootstrap'

class HomePage extends React.Component {
  render() {
    return (
      <Jumbotron className='HomePage'>
        <h1>Channalytics</h1>
        <p>A Slack app for numberphiles.</p>
        <a href={`https://slack.com/oauth/authorize?client_id=${this.props.clientId}&scope=channels%3Aread,channels%3Ahistory,users%3Aread`}>
          <img 
            alt="Add to Slack" 
            height="40" 
            width="139" 
            src="https://platform.slack-edge.com/img/add_to_slack.png" 
          />
        </a>
      </Jumbotron>
    )
  }
}

export default HomePage
