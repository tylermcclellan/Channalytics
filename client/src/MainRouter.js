import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import HomePage from './components/HomePage'
import AppStore from './stores/AppStore'

export class MainRouter extends React.Component {
  getToken = () => {
    const url = window.location.href
    const split = url.split('?')
    return split[1]
  }

  render() {
    const token = this.getToken()
    console.log(AppStore)
    return (
      <Switch>
        <Redirect exact from='/' to='/login' />
        <Route 
          path='/login' 
          component={HomePage}
        />
        <Route 
          path='/dashboard' 
          render={(props) => <Dashboard {...props} uid={token} />}
        />
      </Switch>
    )
  }
}

export default MainRouter
