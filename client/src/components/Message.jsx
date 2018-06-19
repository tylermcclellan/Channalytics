import React from 'react';

//WIP
const Message = ({content, user}) => (
    <li className={`chat ${user === 'user' ? "right" : "left"}`}>
        {content}
    </li>
)

export default Message
