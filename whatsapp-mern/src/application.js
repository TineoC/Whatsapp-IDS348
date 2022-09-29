import React, { useEffect, useState } from "react";
import './application.css';
import Chat from "./Chat";
import Sidebar from "./Sidebar"
import Pusher from "pusher-js";
import axios from "./axios";

function Application() {

  // Tengo que hacer un botón de SignOut que me envíe al Login y que también elimine las variables de sesión

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios.get('/messages/sync').then((response) => {
      setMessages(response.data)
    });
  }, []);

  const [chats, setChats] = useState([]);
  useEffect(() => {
    axios.get('/chat/search', { params: {
      users: `${sessionStorage.getItem('email')}`}
    }).then((response) => {
      setChats(response.data)
    })
  }, []);


  useEffect(() => {
    const pusher = new Pusher('3d8a99912b841f62956d', {
      cluster: 'us2',
    });

    const channel = pusher.subscribe('messages');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar chats={chats} />
        <Chat messages={messages}/>
      </div>


    </div>
  );
}

export default Application;
