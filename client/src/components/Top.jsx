import ChannelInfo from './ChannelInfo'
import ChannelList from './ChannelList'
import PieChart from './PieChart'
import React from 'react'
import Watson from './Watson'
import { Row, Col } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'

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
          title={"User Participation"}
          values={props.store.chart.numbers}
          x={1.25}
          y={1.25}
        />
      </Col>
    </Row>
  )
}

export default inject('store')(observer(Top))
