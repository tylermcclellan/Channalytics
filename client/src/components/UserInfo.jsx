import React from 'react'

const UserInfo = ({profile}) => {
  return (
    <div>
      <h1><b>WIP</b></h1>
      <h1><strong>{profile.real_name.toUpperCase()}</strong></h1>
      <p><i>{profile.title}</i></p>
      <p>Email: {profile.email || 'No email listed'}</p>
      <p>Phone: {profile.phone || 'No phone number listed'}</p>
      <p>Status: {profile.status_text || 'No status listed'}</p>
    </div>
  )
}

export default UserInfo
