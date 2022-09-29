import React from 'react'
import "./SidebarChat.css"
import { Avatar } from "@material-ui/core"

function SidebarChat( { chat }) {
  console.log(chat)
  // Agregar los parámetros de id y usuarios en el chat para así buscar los mensajes y eso tal vez
  return (
    <div className='sidebarChat'>
        <Avatar />
        <div className='sidebarChat_info'>
            <h2>{chat.name}</h2>
            <p>This is the last message</p>
        </div>
    </div>
  )
}

export default SidebarChat