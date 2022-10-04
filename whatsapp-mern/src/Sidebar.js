import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import { Avatar, IconButton, Button } from "@material-ui/core"
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import SidebarChat from './SidebarChat';
import styled from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from './components/Modal'
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import axios from "./axios";

function Sidebar({ chats }) {

    let nav = useNavigate();
    let location = useLocation();
    const animatedComponents = makeAnimated();

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

    const colourOptions = [
        { value: 'Red', label: 'Red' },
        { value: 'Orange', label: 'Orange' },
        { value: 'Yellow', label: 'Yellow' },
        { value: 'Green', label: 'Green' },
        { value: 'Light Blue', label: 'Light Blue' },
        { value: 'Blue', label: 'Blue' },
        { value: 'Purple', label: 'Purple' },
        { value: 'Pink', label: 'Pink' }
        ]

    const [show, setShow] = useState(false);

    const [contacts, setContacts] = useState([]);
    useEffect(() => {
      axios.get('/user/byName', { params: {
        users: `${location.state}`}
      }).then((response) => {
        console.log(location)
        setContacts(response.data)
      })
    }, []);

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
            <SidebarButton onClick={() => setShow(true)} >Create a new chat</SidebarButton>
            <Modal title="Create new chat" onClose={() => setShow(false)} show={show}>
            <Select
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={colourOptions}
            />
            </Modal>
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

export default Sidebar;


const SidebarButton = styled(Button)`
    width: 100%;
    align-items: center;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    padding: 5;
`;