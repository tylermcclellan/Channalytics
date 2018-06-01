import React from 'react'
import { 
  Grid,
  Row,
  Col
} from 'react-bootstrap'
import Sidebar from './Sidebar'
import PageBody from './PageBody'
import Header from './Header'
import LoadingPage from './LoadingPage'
import '../App.css'


class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      currentChannel: 'general',
      users: {},
      currentUsers: {},
      channelList: [],
      chart: {},
      loaded: false
    }
    this.handleChannelClick = this.handleChannelClick.bind(this)
  }
 
  async getUsers(){
    try {
      const response = await fetch(`/api/run/${this.props.uid}/`)
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
      const response = await fetch(`/api/channels/${this.props.uid}`)
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
    const channel = e.target.innerHTML
    const u = this.state.users
    const users = this.state.users.channels[channel].users
    const chart = this.initChart(users)
    const numUsers = Object.keys(users).length
    const messages = u.channels[channel].totalMessages
    const wordCount = u.channels[channel].totalWordCount
    const avgLength = wordCount/messages
    const avgSentiment = u.channels[channel].sentiment/messages
    this.setState({ 
      currentChannel: channel,
      currentUsers: users,
      chart: chart,
      numUsers: numUsers,
      messages: messages,
      wordCount: wordCount,
      avgLength: avgLength,
      avgSentiment: avgSentiment
    })
  }

  async componentDidMount() {
    const currentChannel = this.state.currentChannel
    const u = await this.getUsers()
    const users = u.channels[currentChannel].users
    const c = await this.getChannels()
    const chart = this.initChart(users)
    const numUsers = Object.keys(users).length
    const messages = u.channels[currentChannel].totalMessages
    const wordCount = u.channels[currentChannel].totalWordCount
    const avgLength = wordCount/messages
    const avgSentiment = u.channels[currentChannel].sentiment/messages
    this.setState({
      users: u,
      globalUsers: u.users,
      personality: u.insights,
      currentUsers: users,
      channelList: c,
      chart: chart,
      numUsers: numUsers,
      messages: messages,
      avgLength: avgLength,
      avgSentiment: avgSentiment,
      wordCount: wordCount,
      loaded: true
    })
  }


  render() {
    const loading = this.state.loaded ? false : true
    const requestSuccess = this.state.personality !== undefined ? true : false
    return (
      <div className='App'>
      { loading ? (
        <LoadingPage/>
      ) : (
        <div>
          <Header currentChannel={this.state.currentChannel}/>
          <Grid>
            <Row>
              <Col md={3} lg={3}>
                <Sidebar
                  channels={this.state.channelList} 
                  handleClick={this.handleChannelClick}
                  personality={this.state.personality} 
                  showPersonality={requestSuccess}/>
              </Col>
              <Col md={9} lg={9} >
                <PageBody
                  users={this.state.currentUsers}
                  globalUsers={this.state.globalUsers}
                  names={this.state.chart.names} 
                  numbers={this.state.chart.numbers} 
                  messages={this.state.messages}
                  words={this.state.wordCount}
                  numUsers={this.state.numUsers}
                  avgLength={this.state.avgLength}
                  avgSentiment={this.state.avgSentiment}/>
              </Col>
            </Row>
          </Grid>
        </div>
        )}
      </div>
    )
  }
}

export default Dashboard
