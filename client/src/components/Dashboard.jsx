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
import store from '../stores/AppStore'
import { observer } from 'mobx-react'
import '../App.css'


class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.handleChannelClick = this.handleChannelClick.bind(this)
  }

  //API call to backend
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

  //API call to backend
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

  //updates information in PageBody when a channel name is clicked
  handleChannelClick(e) {
    store.setCurrentChannel(e.target.innerHTML)
  }

  //Loading function
  async componentDidMount() {
    const u = await this.getUsers()
    const c = await this.getChannels()
    store.initStore({
      users: u,
      channelList: c,
      loaded: true
    })
  }


  render() {
    const loading = store.loaded ? false : true
    const requestSuccess = store.personality !== undefined ? true : false
    return (
      <div className='App'>
      { loading ? (
        <LoadingPage/>
      ) : (
        <div>
          <Header currentChannel={store.currentChannel}/>
          <Grid>
            <Row>
              <Col md={3} lg={3}>
                <Sidebar
                  channels={store.channelList} 
                  handleClick={this.handleChannelClick}
                  personality={store.personality} 
                  showPersonality={requestSuccess}/>
              </Col>
              <Col md={9} lg={9} >
                <PageBody
                  users={store.currentUsers}
                  globalUsers={store.globalUsers}
                  names={store.chart.names} 
                  numbers={store.chart.numbers} 
                  messages={store.messages}
                  words={store.wordCount}
                  numUsers={store.numUsers}
                  avgLength={store.avgLength}
                  avgSentiment={store.avgSentiment}/>
              </Col>
            </Row>
          </Grid>
        </div>
        )}
      </div>
    )
  }
}

export default observer(Dashboard)

