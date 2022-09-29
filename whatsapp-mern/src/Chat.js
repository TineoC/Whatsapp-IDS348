import React, { useState } from 'react'
import "./Chat.css"
import { Avatar, IconButton } from "@material-ui/core"
import SearchIcon from '@material-ui/icons/Search';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import axios from "./axios";


function Chat({ messages }) {

  const userName = sessionStorage.getItem('name')
  const [input, setInput] = useState('')

  const sendMessage = async (e) => {
    e.preventDefault();
    await axios.post('/messages/new', {
      message: input,
      name: userName,
      timestamp: new Date().toLocaleTimeString('default', {
        hour: '2-digit',
        minute: '2-digit',
      }),
      received: false,
    });

    setInput('');
  }
// Tengo que suministrar la información del chat en uso para que asuma este tema del nombre
  return (
    <div className='chat'>
        <div className='chat_header'>
          <Avatar />
          <div className='chat_headerInfo'>
            <h3>Room name</h3>
            <p>Última vez visto...</p>
          </div>
          <div className='chat_headerRight'>
                <IconButton>
                    <SearchIcon />
                </IconButton>
                <IconButton>
                    <AttachFileIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </div>
        </div>
        <div className='chat_body'> 
          {messages.map((message) => (
            <p className={`chat_message ${message.name === sessionStorage.getItem('name') && "chat_receiver"}`}> {/*Para hacer la lógica de autenticación tengo que revisar si el nombre del usuario que envió el mensaje es cual o quién e igual concatenarle lo e receiver*/}
              <span className='chat_name'>{message.name}</span>
              {message.message}
              <span className='chat_timestamp'>{message.timestamp}</span>
            </p>
          ))}
        </div>

        <div className='chat_footer'>
          <IconButton>
            <InsertEmoticonIcon />
          </IconButton>
          <form>
            <input value={input} onChange={e => setInput(e.target.value)} placeholder='Mensaje' type="text" />
            <button onClick={sendMessage} type="sumbit">Enviar</button>
          </form>
          <IconButton>
            <MicIcon />
          </IconButton>
        </div>

    </div>
  )
}

export default Chat