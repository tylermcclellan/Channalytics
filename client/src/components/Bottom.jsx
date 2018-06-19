import React from 'react'
import UserList from './UserList'
import { Row, Col } from 'react-bootstrap'

const Bottom = () => {
  return (
    <Row>
      <Col>
        <UserList />
        <p>*Sentiment is a way of measuring the polarity of a messages. A positive sentiment means that the message is positive like "good" or "nice" and vice versa</p>
      </Col>
    </Row>
  )
}

export default Bottom
