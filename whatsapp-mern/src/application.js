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

  /*const [user, setUser] = useState([]);
  useEffect(() => {
    axios.get('user/login', { params: {
      id: `${nbf}`
    }
  }).then(res => {
      console.log(res.data)
      setUser(res.data)
    })
  }, []);*/

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

  const queryString = window.location.search;
  console.log(queryString);

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar />
        <Chat messages={messages}/>
      </div>


    </div>
  );
}

export default Application;
