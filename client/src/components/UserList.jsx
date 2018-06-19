import React from 'react'
import { ListGroup, Row, Col } from 'react-bootstrap'
import { observer, inject } from 'mobx-react'

class UserList extends React.Component {
  constructor(props){
    super(props)
    this.handleSort = this.handleSort.bind(this)
  }

  //Handles sorting the user list when a category title is clicked
  //TODO: add in arrow icons to make sorting functionality more obvious
  handleSort(e){
    let sorter = e.target.innerHTML.toLowerCase()
    switch(sorter) {
      case 'percentage':
        sorter = 'percent'
        break
      case 'user':
        sorter = 'name'
        break
      case 'words':
        sorter = 'numWords'
        break
      default:
        break
    }
    //TODO: fix weird sorting bug
    this.props.store.setSorter(sorter)
  }

  render() {
    return (
      <div>
        <Row className='pointer'>
          <Col md={3} lg={3}>
            <span onClick={this.handleSort}><b>User</b></span>
          </Col>
          <Col md={2} lg={2}>
            <span onClick={this.handleSort}><b>Percentage</b></span>
          </Col>
          <Col md={1} lg={1}>
            <span onClick={this.handleSort}><b>Messages</b></span>
          </Col>
          <Col md={1} lg={1}>
            <span onClick={this.handleSort}><b>Words</b></span>
          </Col>
          <Col md={2} lg={2}>
            <span onClick={this.handleSort}><b>Sentiment</b></span>
          </Col>
          <Col md={2} lg={2}>
            <span><b>Unique Words</b></span>
          </Col>
        </Row>
        <Row>
          <ListGroup className='UserList'>{this.props.store.userList}</ListGroup>
        </Row>
      </div>
    )
  }
}

export default inject('store')(observer(UserList))
