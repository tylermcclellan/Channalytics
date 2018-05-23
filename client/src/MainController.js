import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import HomePage from './components/HomePage'

export class MainController extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      authed: false,
      clientId: ''
    }
  }

  

  async componentWillMount() {
    const authed = await fetch('/api/authed')
    const response = await fetch('/api/client')
    const clientId = await response.json()
    console.log(clientId)
    this.setState({ 
      authed: authed, 
      clientId: clientId.id
    })
  }
  
  render() {
    const defaultRoute = this.state.authed ? '/working' : '/login'
    return (
      <Switch>
        <Redirect exact from='/' to={defaultRoute}/>
        <Route 
          path='/login' 
          render={(props) => <HomePage {...props} clientId={this.state.clientId}/>}
        />
        <Route 
          path='/dashboard' 
          component={Dashboard} 
        />
      </Switch>
    )
  }
}

export default MainController
