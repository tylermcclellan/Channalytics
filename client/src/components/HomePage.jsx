import React from 'react'
import { Jumbotron } from 'react-bootstrap'

const HomePage = () => {
  return (
    <Jumbotron className='Jumbotron'>
      <h1>Channalytics</h1>
      <p>A Slack app for numberphiles.</p>
      <a href="https://slack.com/oauth/authorize?scope=identity.basic&client_id=4845121638.361800582950">
        <img 
          alt="Sign in with Slack" 
          height="40" 
          width="172" 
          src="https://platform.slack-edge.com/img/sign_in_with_slack.png" 
        />
      </a>
    </Jumbotron>
  )
}

export default HomePage
