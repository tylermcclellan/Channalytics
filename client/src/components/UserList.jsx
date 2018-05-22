import React from 'react'
import UserItem from './UserItem'
import { ListGroup, Grid, Row, Col } from 'react-bootstrap'

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}


class UserList extends React.Component {
  
  createUserList() {
    const userList = Object.keys(this.props.users)
    const mappedList = userList.map( u => {
      const user = this.props.users[u]
      const rawSource = user.profile.image_48
      const source = rawSource.replace(`\\`, ``)
      const name = user.real_name
      const percent = `${round(user.numMessages/this.props.messages*100, 2)}%`
      const messages = user.numMessages
      const words = user.numWords
      let unique = user.uniqueWords.map( 
        word => word !== user.uniqueWords[user.uniqueWords.length-1] ? `${word}, ` : `${word}`
      )
      
      return <UserItem 
        key={u}
        img={source}
        name={name}
        percent={percent}
        messages={messages}
        words={words}
        unique={unique} />
    })
    return mappedList
  }
  
  render() {
    const userList = this.createUserList()
    return (
      <Grid>
        <Row mdPull={2} lgPull={2}>
          <Col md={3} mdPush={1} lg={3} lgPush={1}><b>User</b></Col>
          <Col md={1} lg={1}><b>Percentage</b></Col>
          <Col md={1} lg={1}><b>Messages</b></Col>
          <Col md={1} lg={1}><b>Words</b></Col>
          <Col md={3} lg={3}><b>Unique Words</b></Col>
        </Row>
        <ListGroup>{userList}</ListGroup>
      </Grid>
    )
  }
}

export default UserList
