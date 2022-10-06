import React, { useEffect, useState } from 'react'
import "./SidebarChat.css"
import { Avatar } from "@material-ui/core"
import { useLocation } from 'react-router-dom';

function SidebarChat({ chat }) {
  // Agregar los parámetros de id y usuarios en el chat para así buscar los mensajes y eso tal vez
  // Coódigo para obtener último mensaje > db.messagecontents.find({ chat : `${chat.id}`}).sort({_id:-1}).limit(1);
  // Entiendo que debe ser alg así
  const location = useLocation();

  const [recipient, setRecipient] = useState('');
  useEffect(() => {
    const found = chat.users.findIndex(element => element !== `${location.state}`);
    if (found > -1) {
      console.log(chat.users.toString().replace(',','').replace(`${location.state}`, ''))
      setRecipient(chat.users.splice(found, 1))
    } 
  }, [])

  return (
    <div className='sidebarChat'>
        <Avatar src={chat.picture.replace(sessionStorage.getItem('picture'), '')}></Avatar>
        <div className='sidebarChat_info'>
        {chat.name === "" && 
            <h2>{recipient[0]}</h2>
        }
        {chat.name !== "" && <h2>{chat.name}</h2>}
            <p>Aqui es que va el mensaje</p>
        </div>
    </div>
  )
}

export default SidebarChat