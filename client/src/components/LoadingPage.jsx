import React from 'react'
import { Jumbotron } from 'react-bootstrap'

class LoadingPage extends React.Component {
  render(){
    return (
      <Jumbotron>
        <h1>Fetching conversations from Slack</h1>
        <p>No need to worry though! We don't record any of your information or conversations.</p>
        <p>To do that, we have to fetch the messages from Slack all over again every time the page reloads.</p>
        <p>So... this could take a while...</p>
      </Jumbotron>
    )
  }
}

export default LoadingPage
