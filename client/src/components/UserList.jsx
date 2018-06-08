import React from 'react'
import UserItem from './UserItem'
import { ListGroup, Row, Col } from 'react-bootstrap'
const _ = require('lodash')

const round = (value, decimals) => {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals)
}

class UserList extends React.Component {
  constructor(props) {
    super(props)
    this.state = { userList: [] }
    this.handleSort = this.handleSort.bind(this)
  }

  //Handles sorting the user list when a category title is clicked
  //TODO: add in arrow icons to make sorting functionality more obvious
  handleSort(e){
    const rawText = e.target.innerHTML
    const loweredText = rawText.toLowerCase()
    let sorter = loweredText
    switch(loweredText) {
      case 'percentage':
        sorter = 'percent'
        break
      case 'user':
        sorter = 'name'
        break
      default:
        break
    }
    //TODO: fix weird sorting bug
    const userList = this.state.userList
    const sortedList = _.sortBy(userList, [item => item.props[sorter]])
    let list = sortedList
    if (sorter !== 'name') list = list.reverse()
    this.setState({ userList: list })
  }

  //Creates initial UserList from props
  static getDerivedStateFromProps(props, state){
    const userList = Object.keys(props.users)
    const mappedList = userList.map( u => {
      const user = props.users[u]
      const messageDump = props.globalUsers[u].messageDump
      const rawSource = user.profile.image_48
      const source = rawSource.replace(`\\`, ``)
      const name = user.real_name
      const percent = round(user.numMessages/props.messages*100, 2)
      const messages = user.numMessages
      const numWords = user.numWords
      let unique = user.uniqueWords.map( 
        word => word !== user.uniqueWords[user.uniqueWords.length-1] ? `${word}, ` : `${word}`
      )
      const sentiment = round(user.sentiment/user.numMessages, 4)
      
      return <UserItem 
        key={u}
        img={source}
        name={name}
        messageDump={messageDump}
        percent={percent}
        messages={messages}
        words={user.words}
        numWords={numWords}
        unique={unique} 
        sentiment={sentiment}/>
      })
    return { userList: mappedList }
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
          <ListGroup className='UserList'>{this.state.userList}</ListGroup>
        </Row>
      </div>
    )
  }
}

export default UserList
