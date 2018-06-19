import React from 'react'
import PieChart from './PieChart'
import UserInfo from './UserInfo'
import ImpersonationBot from './ImpersonationBot'
import { inject, observer } from 'mobx-react'
import { Row, Col, Image, Grid } from 'react-bootstrap'

const ProfilePage = ({store}) => {
  const { user, participation, pos } = store.userProfile
  return (
    <Grid>  
      <Row>
        <Col md={5} lg={5}>
          <Row>
            <Col mdOffset={1} lgOffset={1}>
              <Image 
                src={user.profile.image_192}
                alt="Image not found"
                rounded
              />
            </Col>
          </Row>
          <Row>
            <PieChart 
              labels={participation.labels}
              values={participation.values}
              x={0.6}
              y={0.6}
              title="User Participation"
            />
          </Row>
          <Row>
            <PieChart 
              labels={pos.labels}
              values={pos.values}
              x={0.6}
              y={0.6}
              title="Part Of Speech Usage"
            />
          </Row>
        </Col>
        <Col md={7} lg={7}>
          <UserInfo profile={user.profile} />
          <ImpersonationBot />
        </Col>
      </Row>
    </Grid>
  )
}

export default inject('store')(observer(ProfilePage))