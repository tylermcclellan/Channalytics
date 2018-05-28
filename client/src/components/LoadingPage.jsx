import React from 'react'
import { Jumbotron } from 'react-bootstrap'

class LoadingPage extends React.Component {
  render(){
    return (
      <Jumbotron>
        <h1>Loading</h1>
        <small>This could take a while...</small>
      </Jumbotron>
    )
  }
}

export default LoadingPage
