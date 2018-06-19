import ImpersonationStore from '../stores/ImpersonationStore'
import React from 'react'
import { inject, observer } from 'mobx-react'

class ImpersonationBot extends React.Component {
  constructor(props){
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick = () => {
    ImpersonationStore.markov(this.props.store.users.users[this.props.store.userName].messageDump)
  }

  render(){
    return (
      <div>
        <span>
          <h3>ImpersonationBot</h3>
          <button onClick={this.handleClick}>Impersonate</button>
        </span>
        <p>{ImpersonationStore.content || "Click the button for an impersonation!"}</p>
      </div>
    )
  }
}

export default inject('store')(observer(ImpersonationBot))
