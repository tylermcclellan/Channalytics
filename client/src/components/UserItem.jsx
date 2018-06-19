import React from 'react'
import { 
  ListGroupItem, 
  Image,
  Row, 
  Col 
} from 'react-bootstrap'
import { inject, observer } from 'mobx-react'

class UserItem extends React.Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = () => {
    this.props.store.setUserName(this.props.id)
  }

  render() {
    return (
      <ListGroupItem onClick={this.handleClick}>
          <Row>
            <Col md={1} lg={1}>
              <Image 
                src={this.props.img}
                alt="Image not found"
                rounded
              />
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

export default inject('store')(observer(UserItem))
