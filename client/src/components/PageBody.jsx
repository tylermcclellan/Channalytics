import React from 'react'
import PieChart from './PieChart'
import ChannelInfo from './ChannelInfo'
import UserList from './UserList'
import { Row, Col, Well } from 'react-bootstrap'

class ChannelMain extends React.Component {
  
  render() {
    return (
      <div>
        <Row>
          <Col md={9} lg={9}>
            <PieChart names={this.props.names} numbers={this.props.numbers}/ >
          </Col>
          <Col md={3} lg={3}>
            <Well>
              <ChannelInfo 
                messages={this.props.messages}
                words={this.props.words}
                users={this.props.numUsers}
                avgLength={this.props.avgLength}/>
            </Well>
          </Col>
        </Row>
        <Row>
          <UserList users={this.props.users} messages={this.props.messages}/>
        </Row>
      </div>
    )
  }
}

  export default ChannelMain
