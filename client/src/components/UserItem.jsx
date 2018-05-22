import React from 'react'
import { ListGroupItem, Image, Row, Col } from 'react-bootstrap'

class UserItem extends React.Component {
  render() {
    return (
      <ListGroupItem>
          <Row>
            <Col md={1} lg={1}>
              <span><Image src={this.props.img} alt="img not found" rounded/></span> 
            </Col>
            <Col md={2} lg={2}>
              <span>{this.props.name}</span> 
            </Col>
            <Col md={1} lg={1}>
              <span>{this.props.percent}</span>
            </Col>
            <Col md={1} lg={1}>
              <span>{this.props.messages}</span>
            </Col>
            <Col md={1} lg={1}>
              <span>{this.props.words}</span>
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
