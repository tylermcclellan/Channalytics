import ImpersonationBot from './ImpersonationBot'
import PieChart from './PieChart'
import React from 'react'
import UserInfo from './UserInfo'
import { Row, Col, Image, Grid } from 'react-bootstrap'
import { inject, observer } from 'mobx-react'

const ProfilePage = ({store}) => {
  const { user, participation, pos } = store.userProfile
  return (
    <Grid>  
      <Row>
        <Col md={5} lg={5}>
          <Row>
            <Col mdOffset={1} lgOffset={1}>
              <Image 
                alt="Image not found"
                rounded
                src={user.profile.image_192}
              />
            </Col>
          </Row>
          <Row>
            <PieChart 
              labels={participation.labels}
              title="User Participation"
              values={participation.values}
              x={0.6}
              y={0.6}
            />
          </Row>
          <Row>
            <PieChart 
              labels={pos.labels}
              title="Part Of Speech Usage"
              values={pos.values}
              x={0.6}
              y={0.6}
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
