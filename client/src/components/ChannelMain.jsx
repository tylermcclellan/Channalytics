import React from 'react'
import PieChart from './PieChart'
import ChannelInfo from './ChannelInfo'
import { Row, Col, Well } from 'react-bootstrap'

class ChannelMain extends React.Component {
  
  render() {
    return (
      <Row>
        <Col md={9} lg={9}>
          <PieChart names={this.props.names} numbers={this.props.numbers}/ >
        </Col>
        <Col md={3} lg={3}>
          <Well>
            <ChannelInfo 
              messages={this.props.messages}
              words={this.props.words}
              users={this.props.users}
              avgLength={this.props.avgLength}/>
          </Well>
        </Col>
      </Row>
    )
  }
}

  export default ChannelMain
