import React from 'react'
import { Switch, Route } from 'react-router-dom'
import WorkingPage from './components/WorkingPage'
import HomePage from './components/HomePage'

export class MainController extends React.Component {
  constructor(props) {
    super(props)
    this.state = { authed: false }
  }
  
  render() {
    //const defaultRoute = !this.state.authed ? '/working' : '/login'
    return (
      <Switch>
        <Route exact path='/working' component={WorkingPage} />
        <Route exact path='/login' component={HomePage}/>
      </Switch>
    )
  }
}

export default MainController
