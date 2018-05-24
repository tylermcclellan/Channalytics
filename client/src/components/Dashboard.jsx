import React from 'react'
import { 
  Grid,
  Row,
  Col
} from 'react-bootstrap'
import ChannelList from './ChannelList'
import PageBody from './PageBody'
import Header from './Header'
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
    console.log(`e.target: ${e.target.innerHTML}`)
    const channel = e.target.innerHTML
    console.log('getting channel' + channel)
    const u = await this.getUsers(channel)
    const chart = this.initChart(u.users)
    this.setState({ 
      users: u.users,
      numUsers: Object.keys(u.users).length,
      words: u.totalWords,
      numWords: u.totalWordCount,
      messages: u.totalMessages,
      avgLength: (u.totalWordCount/u.totalMessages),
      currentChannel: channel,
      chart: chart,
    })
  }

  async componentWillMount() {
    console.log('getting users')
    const u = await this.getUsers(this.state.currentChannel)
    const c = await this.getChannels()
    const chart = this.initChart(u.users)
    this.setState({ 
      users: u.users,
      numUsers: Object.keys(u.users).length,
      words: u.totalWords,
      numWords: u.totalWordCount,
      messages: u.totalMessages,
      avgLength: (u.totalWordCount/u.totalMessages),
      channelList: c,
      chart: chart,
    })
  }


  render() {
    return (
      <div className='App'>
        <Header currentChannel={this.state.currentChannel}/>
        <Grid fluid={true}>
          <Row>
            <Col md={2} lg={2} className='sidebar'>
              <ChannelList 
                channels={this.state.channelList} 
                handleClick={this.handleChannelClick}/>
            </Col>
            <Col md={8} lg={8}>
              <PageBody
                users={this.state.users}
                names={this.state.chart.names} 
                numbers={this.state.chart.numbers} 
                messages={this.state.messages}
                words={this.state.numWords}
                numUsers={this.state.numUsers}
                avgLength={this.state.avgLength}/>
            </Col>
          </Row>
        </Grid>
      </div>
    )
  }
}

export default Dashboard
