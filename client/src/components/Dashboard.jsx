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
import { observer, inject } from 'mobx-react'
import '../App.css'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.handleChannelClick = this.handleChannelClick.bind(this)
  }

  //API call to get users from backend
  async getUsers(){
    try {
      const response = await fetch(`/api/run/${this.props.uid}/`)
      const body = await response.json()
      if (response.status !== 200) throw Error(body.message)
      return body
    } catch(e) {
      console.log(e)
    }
  }

  //API call to get channel list from backend
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

  //updates current channel in store when a channel name is clicked
  handleChannelClick(e) {
    this.props.myStore.setCurrentChannel(e.target.innerHTML)
  }

  //Initializes this.props.myStore with users and channels
  async componentDidMount() {
    const u = await this.getUsers()
    const c = await this.getChannels()
    this.props.myStore.initStore({
      users: u,
      channelList: c,
      loaded: true
    })
  }

  render() {
    const loading = this.props.myStore.loaded ? false : true
    const requestSuccess = this.props.myStore.personality !== undefined ? true : false
    return (
      <div className='App'>
      { loading ? (
        <LoadingPage/>
      ) : (
        <div>
          <Header currentChannel={this.props.myStore.currentChannel}/>
          <Grid>
            <Row>
              <Col md={3} lg={3}>
                <Sidebar
                  channels={this.props.myStore.channelList} 
                  handleClick={this.handleChannelClick}
                  personality={this.props.myStore.personality} 
                  showPersonality={requestSuccess}/>
              </Col>
              <Col md={9} lg={9} >
                <PageBody
                  users={this.props.myStore.currentUsers}
                  globalUsers={this.props.myStore.globalUsers}
                  names={this.props.myStore.chart.names} 
                  numbers={this.props.myStore.chart.numbers} 
                  messages={this.props.myStore.messages}
                  words={this.props.myStore.wordCount}
                  numUsers={this.props.myStore.numUsers}
                  avgLength={this.props.myStore.avgLength}
                  avgSentiment={this.props.myStore.avgSentiment}/>
              </Col>
            </Row>
          </Grid>
        </div>
        )}
      </div>
    )
  }
}

export default inject('myStore')(observer(Dashboard))

