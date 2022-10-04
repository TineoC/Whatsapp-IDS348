import React, { useEffect, useState } from 'react'
import "./SidebarChat.css"
import { Avatar } from "@material-ui/core"
import Pusher from "pusher-js";

function SidebarChat({ chat }) {
  // Agregar los parámetros de id y usuarios en el chat para así buscar los mensajes y eso tal vez
  // Coódigo para obtener último mensaje > db.messagecontents.find({ chat : `${chat.id}`}).sort({_id:-1}).limit(1);
  // Entiendo que debe ser alg así
  const [lastmessage, setLastMessage] = useState([]);
  useEffect(() => {
    const pusher = new Pusher('3d8a99912b841f62956d', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe('messages'); // Ver como modifico el método para lo filtre por el chat
    channel.bind('inserted', (newMessage) => {
      setLastMessage([...lastmessage, newMessage]);
    });

    console.log(lastmessage[lastmessage.length - 1]?.message);
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [lastmessage]);


  return (
    <div className='sidebarChat'>
        <Avatar src={chat.picture}></Avatar>
        <div className='sidebarChat_info'>
            <h2>{chat.name}</h2>
            <p>Aqui es que va el mensaje</p>
            <script>document.getElementById('lastMessage').innerHTML = {lastmessage[lastmessage.length - 1]?.message}</script>
        </div>
    </div>
  )
}

export default SidebarChat