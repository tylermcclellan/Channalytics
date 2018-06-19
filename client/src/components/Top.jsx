import React from 'react'
import ChannelList from './ChannelList'
import Watson from './Watson'
import ChannelInfo from './ChannelInfo'
import PieChart from './PieChart'
import { inject, observer } from 'mobx-react'
import { Row, Col } from 'react-bootstrap'

const Top = (props) => {
  return (
    <Row>
      <Col md={3} lg={3}>
        <ChannelList handleClick={props.handleClick} />
        {
          props.store.personality !== undefined ? (
                <Watson />
          ) : (
            ''
          )
        }
        <ChannelInfo />
      </Col>
      <Col md={9} lg={9}>
        <PieChart 
          labels={props.store.chart.names}
          values={props.store.chart.numbers}
          x={1.25}
          y={1.25}
          title={"User Participation"}
          />
      </Col>
    </Row>
  )
}

export default inject('store')(observer(Top))
