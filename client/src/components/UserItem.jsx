import React from 'react'
import { 
  ListGroupItem, 
  Row, 
  Col 
} from 'react-bootstrap'
import Impression from './Impression'

class UserItem extends React.Component {
  render() {
    const filler = <Impression messageDump={this.props.messageDump} />
    console.log(filler)
    return (
      <ListGroupItem>
          <Row>
            <Col md={1} lg={1}>
              <Impression img={this.props.img} messageDump={this.props.messageDump} />
            </Col>
            <Col md={2} lg={2}>
              <span>{this.props.name}</span> 
            </Col>
            <Col md={2} lg={2}>
              <span>{this.props.percent}%</span>
            </Col>
            <Col md={1} lg={1}>
              <span>{this.props.messages}</span>
            </Col>
            <Col md={1} lg={1}>
              <span>{this.props.numWords}</span>
            </Col>
            <Col md={1} lg={1}>
              <span>{this.props.sentiment}</span>
            </Col>
            <Col md={1} lg={1}>
            </Col>
            <Col md={3} lg={3}>
              <span>{this.props.unique}</span>
            </Col>
          </Row>
      </ListGroupItem>
    )
  }
}

export default UserItem

