import React from 'react'
import { PageHeader } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'

class Header extends React.Component{
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick(){
    this.props.store.setUserName(null)
  }
  
  render() {
    return <PageHeader style={{cursor: "pointer"}} onClick={this.handleClick}>CHANNALYTICS <small style={{color: 'white'}}>{this.props.store.currentChannel}</small></PageHeader>
  }
}

export default inject('store')(observer(Header))
