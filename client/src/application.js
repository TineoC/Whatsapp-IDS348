import React, { useEffect, useState } from "react";
import "./application.css";
import Chat from "./Chat";
import Sidebar from "./Sidebar";
import Pusher from "pusher-js";
import axios from "./axios";
import { useLocation, useParams } from "react-router-dom";

function Application() {
  // Tengo que hacer un botón de SignOut que me envíe al Login y que también elimine las variables de sesión

  const location = useLocation();
  let { id } = useParams();

  const [messages, setMessages] = useState([]);
  useEffect(() => {
    axios
      .get("/messages/sync", {
        params: {
          chat: `${id}`,
        },
      })
      .then((response) => {
        setMessages(response.data);
      });
  }, [id]);

  const [chats, setChats] = useState([]);
  useEffect(() => {
    axios
      .get("/chat/search", {
        params: {
          users: `${location.state}`,
        },
      })
      .then((response) => {
        setChats(response.data);
      });
  }, [location.state]);

  useEffect(() => {
    const pusher = new Pusher("858cc04faf26ef2afed9", {
      // 858cc04faf26ef2afed9
      cluster: "us2",
    });

    const channel = pusher.subscribe("messages");
    channel.bind("inserted", (newMessage) => {
      setMessages([...messages, newMessage]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [messages]);

  useEffect(() => {
    const pusher = new Pusher("3d8a99912b841f62956d", {
      cluster: "us2",
    });

    const channel = pusher.subscribe("chats");
    channel.bind("inserted", (newChat) => {
      setChats([...chats, newChat]);
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [chats]);

  return (
    <div className="app">
      <div className="app_body">
        <Sidebar chats={chats} />
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default Application;
