import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import { Avatar, IconButton, Button } from "@material-ui/core"
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { SearchOutlined } from '@material-ui/icons';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
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

    const [list, setList] = useState([]);
    useEffect(() => {
        axios.get('/contact/select', {
            params: {
            email: `${location.state}`
            }
        }).then((response) => {
            // Tengo pendiente ver el tema del setState porque no es sincronico y dura mucho para cargarme la información
            setList(response.data[0]?.contacts_info) 
        })
    }, []);

    const contactsOptions = list?.map((contact) => (
            { value : contact.email, label : contact.name}
        ));


    const [show, setShow] = useState(false);
    const [show2, setShow2] = useState(false);
    
    const [showModal, setShowModal] = useState(false);

    const [specificChat, setSpecificChat] = useState([]);
    const [input, setInput] = useState('');
    const searchChat = () =>  {
        axios.get('/chat/searchBy', {
            params: {
                main: `${location.state}`,
                find: `${input}`
            }
        }).then((response) => {
            // Tengo pendiente ver el tema del setState porque no es sincronico y dura mucho para cargarme la información
            setSpecificChat(response.data) 
        })}
        
    const [users, setUsers] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    let IsGrupo = null;
    const handleCreateChat = () => {
        var ChatUsers = [];
        ChatUsers.push(location.state)
        ChatUsers.push(users[0]['value'])
        setChatUsers(ChatUsers)    
        if (users.length === 0){
            // Me tiene que mandar una alerta que se quiere crear un grupo sin personas
        }
        else if (chatUsers.length === 2){
            // Nada, guadar alguna variable o no hacer nada con el tema del nombre y que sé yo
            IsGrupo = false;
            setShow(false);
            handlechatInfo(false);
        }
        else if (chatUsers.length > 2){
            // Invocar otro modal a modo de formulario donde te permita ingresar el nombre del grupo y pegar el link de una imagen
            IsGrupo = true;
            setShow(false);
            setShow2(true);
        }
    }

    const [inputName, setInputName] = useState('');
    const [inputPicture, setInputPicture] = useState('');
    const handlechatInfo = async (ChatType) => {
        // Tengo que hacer el método de create chat en server
        await axios.post('/chat/new', {
            name: inputName,
            creationTime : new Date().toLocaleTimeString(),
            users: chatUsers,
            picture: inputPicture
          });
    }

  return (
    <div className='sidebar'>
        <div className='sidebar_header'>
            <div onClick={() => handleSignOut()}>
                <Avatar src={picture}/>
            </div>
            <div className='sidebar_headerRight'>
                <IconButton>
                </IconButton>
                <IconButton>
                </IconButton>
                <IconButton>
                    <PersonAddIcon onClick={() => setShowModal(true)} />
                    <Modal title="Crear contacto" onClose={() => setShowModal(false)} show={showModal}>
                        <input className="sidebar_searchContainer" placeholder='    Introduzca el email del contacto que desea añadir'></input>
                    </Modal>
                </IconButton>
            </div>
        </div>
        <div className='sidebar_newchatContainer'>
            <SidebarButton onClick={() => setShow(true)} >Create a new chat</SidebarButton>
            <div className='sidebar_modal'>
                <Modal title="Create new chat" onClose={() => setShow(false)} show={show} onSave={() => handleCreateChat()}>
                    <Select closeMenuOnSelect={false} components={animatedComponents} isMulti options={contactsOptions} onChange={setUsers}/>
                </Modal>
                <Modal title="Enter Group Chat Information" onClose={() => setShow2(false)} show={show2} onSave={() => handlechatInfo(IsGrupo)}>
                    <form>
                        <h4>GroupChat Name: </h4>
                        <input type="text" placeholder="Type the name here..." value={inputName} onChange={e => setInputName(e.target.value)} />
                        <h4>Insert GroupChat link picture:</h4>
                        <input type="text" placeholder="Paste link here..." value={inputPicture} onChange={e => setInputPicture(e.target.value)}/>
                    </form>
                </Modal>
            </div>
        </div>
        <div className='sidebar_search'>
            <div className="sidebar_searchContainer">
                <SearchOutlined />
                <input onChange={e => setInput(e.target.value)} placeholder='Busque o inicie un nuevo chat' type="text" value={input}/>
                <SearchButton onClick={() => searchChat()} type="sumbit">Search</SearchButton>
            </div>
        </div>
        {specificChat.length > 0 && 
        <div className='sidebar_chats_searched'>
            <h3>Resultados</h3>
            {specificChat?.map((chat) => (
                <div key={chat._id} onClick={() => handleClickChat(chat)}>
                    <SidebarChat chat={chat} />
                </div>
            ))}
        </div>}
        {specificChat.length === 0 &&
        <div className='sidebar_chats'>
        {chats?.map((chat) => (
            <div key={chat._id} onClick={() => handleClickChat(chat)}>
                <SidebarChat chat={chat} />
            </div>
        ))}
    </div>}
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

const SearchButton = styled(Button)`
    align-items: center;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
    padding: 5;
`;