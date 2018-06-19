import React from 'react'
import { Grid } from 'react-bootstrap'
import Top from './Top'
import Bottom from './Bottom'
import ProfilePage from './ProfilePage'
import Header from './Header'
import LoadingPage from './LoadingPage'
import { observer, inject } from 'mobx-react'
import '../App.css'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)
    this.handleChannelClick = this.handleChannelClick.bind(this)
    this.handleClickHome = this.handleClickHome.bind(this)
  }

  //sets the page back to Dashboard
  handleClickHome(){
    this.props.store.setUserName(null)
  }

  //updates current channel in store when a channel name is clicked
  handleChannelClick(e) {
    this.props.store.setCurrentChannel(e.target.innerHTML)
  }

  //Initializes store with users and channels
  async componentDidMount() {
    await this.props.store.initStore(this.props.uid)
  }

  render() {
    let content
    if (!this.props.store.loaded){
      content = <LoadingPage/>
    } else if (this.props.store.userName === null){
      content = (
        <div>
          <Header style={{cursor: "pointer"}} onClick={this.handleClickHome}/>
          <Grid>
            <Top handleClick={this.handleChannelClick} />
            <Bottom />
          </Grid>
        </div>
      )
    } else {
      content = (
        <div>
          <Header onClick={this.handleClickHome}/>
          <ProfilePage />
         </div>
      )
    }
    return (
      <div className='App'>
        {content}
      </div>
    )
  }
}

export default inject('store')(observer(Dashboard))
