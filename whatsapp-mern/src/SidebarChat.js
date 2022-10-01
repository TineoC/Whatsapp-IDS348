import React from 'react'
import "./SidebarChat.css"
import { Avatar } from "@material-ui/core"

function SidebarChat({ chat }) {
  // Agregar los parámetros de id y usuarios en el chat para así buscar los mensajes y eso tal vez
  // Coódigo para obtener último mensaje > db.messagecontents.find({ chat : `${chat.id}`}).sort({_id:-1}).limit(1);
  // Entiendo que debe ser alg así
  return (
    <div className='sidebarChat'>
        <Avatar>{chat.name.charAt(0)}</Avatar>
        <div className='sidebarChat_info'>
            <h2>{chat.name}</h2>
            <p>This is the last message</p>
        </div>
    </div>
  )
}

export default SidebarChat