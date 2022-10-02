import React, { useEffect } from 'react'
import "./Sidebar.css"
import { Avatar, IconButton, Button } from "@material-ui/core"
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from './SidebarChat';
import styled from 'styled-components';
import axios from './axios';
import { unstable_HistoryRouter, useLocation, useNavigate } from 'react-router-dom';

function sidebar({ chats }) {

    // eslint-disable-next-line react-hooks/rules-of-hooks
    let nav = useNavigate();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    let location = useLocation();

    const picture = sessionStorage.getItem('picture')
    const handleClickChat = (selectedChat) => {
        nav(`/chat/${selectedChat._id}`, { state: `${location.state}`});
        window.location.reload()
    }

    const handleSignOut = () =>{
        sessionStorage.removeItem('picture')
        sessionStorage.removeItem('name')
        nav('/', {replace: true})
    }
    // Tengo que crear un método para que en el onClick me abra alguna ventana o algo que me permita ingresar el email del usuario
    // Con el mail, tengo que revisar que ese correo y verificarlo en la base de datos
    // Con eso entonces ver como genero la el elemento del chat, tengo que ver ese fragmento del código del pana
    // Y Tengo que modificar la estructura de la colección de los mensajes para que contengan alguna clase de identificador único del chat
    // Y que regule los mensajes mostrados en función de ese identificador, en teoría eso está en el vídeo también
    // Tengo que hacer un map de los chats que tenga el usuario que inició sesión y enviar esos maps con la informaciones de cada chat?

  return (
    <div className='sidebar'>
        <div className='sidebar_header'>
            <div onClick={ () => handleSignOut()}>
                <Avatar src={picture}/>
            </div>
            <div className='sidebar_headerRight'>
                <IconButton>
                    <DonutLargeIcon />
                </IconButton>
                <IconButton>
                    <ChatIcon />
                </IconButton>
                <IconButton>
                    <MoreVertIcon />
                </IconButton>
            </div>
        </div>
        <div className='sidebar_newchatContainer'>
            <SidebarButton>Create a new chat</SidebarButton>
        </div>
        <div className='sidebar_search'>
            <div className="sidebar_searchContainer">
                <SearchOutlined />
                <input placeholder='Busque o inicie un nuevo chat' type="text"/>
            </div>
        </div>
        <div className='sidebar_chats'>
            {chats?.map((chat) => (
                <div key={chat._id} onClick={ () => handleClickChat(chat)}>
                    <SidebarChat chat={chat} />
                </div>
            ))}
        </div>
    </div>
  )
}

export default sidebar;


const SidebarButton = styled(Button)`
    width: 100%;
    align-items: center;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    padding: 5;
`;