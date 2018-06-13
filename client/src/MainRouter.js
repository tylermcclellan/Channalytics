import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'
import HomePage from './components/HomePage'
import { Provider } from 'mobx-react'
import AppStore from './stores/AppStore'

const getToken = () => {
  const url = window.location.href
  const split = url.split('?')
  return split[1]
}

export class MainRouter extends React.Component {
  render() {
    const token = getToken()
    return (
      <Provider myStore={AppStore}>
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
      </Provider>
    )
  }
}

export default MainRouter
