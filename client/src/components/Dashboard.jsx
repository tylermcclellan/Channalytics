import React from 'react'
import { 
  PageHeader,
  Grid,
  Row,
  Col
} from 'react-bootstrap'
import ChannelList from './ChannelList'
import UserList from './UserList'
import ChannelMain from './ChannelMain'
import '../App.css'


class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      currentChannel: 'general',
      users: {},
      numUsers: 0,
      words: {},
      numWords: 0,
      avgLength: 0,
      channelList: [],
      chart: {},
      messages: 0,
    }
    this.handleChannelClick = this.handleChannelClick.bind(this)
  }
  
  async getUsers(channel){
    try {
      const response = await fetch(`/api/run/${channel}`)
      const body = await response.json()
      console.log(body)
      if (response.status !== 200) throw Error(body.message)

      return body
    } catch(e) {
      console.log(e)
    }
  }

  async getChannels(){
    try {
      const response = await fetch('/api/channels/')
      const body = await response.json()
      if (response.status !== 200) throw Error(body.message)
      return body
    } catch(e) {
      console.log(e)
    }
  }

  initChart(users) {
    let chartArrs = {}
    const userKeys = Object.keys(users)
    chartArrs.names = userKeys.map(user=> users[user].real_name)
    chartArrs.numbers = userKeys.map(user=> users[user].numMessages)
    return chartArrs
  }

  async handleChannelClick(e) {
    if (!this.state.isLoading){
      console.log(`e.target: ${e.target.innerHTML}`)
      const channel = e.target.innerHTML
      const u = await this.getUsers(channel)
      const chart = this.initChart(u.users)
      const numWords = Object.keys(u.totalWords).length
      this.setState({ 
        users: u.users,
        numUsers: Object.keys(u.users).length,
        words: u.totalWords,
        numWords: numWords,
        messages: u.totalMessages,
        avgLength: (numWords/u.totalMessages),
        currentChannel: channel,
        chart: chart,
      })
    }
  }

  async componentWillMount() {
    console.log('getting users')
    const u = await this.getUsers(this.state.currentChannel)
    const c = await this.getChannels()
    const chart = this.initChart(u.users)
    const numWords = Object.keys(u.totalWords).length
    this.setState({ 
      users: u.users,
      numUsers: Object.keys(u.users).length,
      words: u.totalWords,
      numWords: numWords,
      messages: u.totalMessages,
      avgLength: (numWords/u.totalMessages),
      channelList: c,
      chart: chart,
    })
  }


  render() {
    return (
      <div className='App'>
        <PageHeader>Channalytics <small>{this.state.currentChannel}</small></PageHeader>
        <Grid fluid={true}>
          <Row>
            <Col md={2} lg={2} className='sidebar'>
              <ChannelList 
                channels={this.state.channelList} 
                handleClick={this.handleChannelClick}/>
            </Col>
            <Col md={8} lg={8}>
              <ChannelMain
                names={this.state.chart.names} 
                numbers={this.state.chart.numbers} 
                messages={this.state.messages}
                words={this.state.numWords}
                users={this.state.numUsers}
                avgLength={this.state.avgLength}/>
              <UserList users={this.state.users} messages={this.state.messages}/>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}

export default Dashboard
