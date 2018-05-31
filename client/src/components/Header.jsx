import React from 'react'
import { PageHeader } from 'react-bootstrap'

class Header extends React.Component {
  render() {
    return <PageHeader>CHANNALYTICS <small style={{color: 'white'}}>{this.props.currentChannel}</small></PageHeader>
  }
}

export default Header
