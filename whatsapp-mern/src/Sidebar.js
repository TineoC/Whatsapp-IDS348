import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import { Avatar, IconButton, Button } from "@material-ui/core"
import { SearchOutlined, TimerOutlined } from '@material-ui/icons';
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
            setList(response.data[0]?.contacts_info) 
        })
    }, []);

    const contactsOptions = list?.map((contact) => (
            { value : contact.email, label : contact.name, picture : contact.picture}
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
        
        const [inputEmailContact, setInputEmailContact] = useState('');
        const handleContactInfo = () => {
            if (inputEmailContact !== location.state)
            {
                console.log(inputEmailContact)
                axios.get('/user/login', { params: {
                    email: inputEmailContact
                  }
                  }).then(((res) => {
                    if (res.data.length !== 0){
                        axios.post('/contact/add', {
                            email : location.state,
                            contacts : inputEmailContact
                        });
                    } else {
                        alert("")
                    }
                  }))
                setShowModal(false)
                window.location.reload()
            } else {
                alert("No puede ingresarse a sí mismo como un usuario, favor ingrese un correo electrónico distinto al suyo")
            }
        }

    const [users, setUsers] = useState([]);
    const [chatUsers, setChatUsers] = useState([]);
    const [inputPicture, setInputPicture] = useState('');
    const [inputName, setInputName] = useState('');
    const selectedUsers = users.map(a => a.value);

    const handleCreateChat = () => {
        if (users.length === 0){
            alert("Error: No ha seleccionado ningún usuario, favor elegir el(los) usuarios que desee")
        }
        else if (users.length === 1){
            var ChatUsers = [];
            ChatUsers.push(location.state)
            ChatUsers.push(users[0]['value'])
            setShow(false);
            axios.get('/chat/searchBy', {
                params: {
                    main: `${location.state}`,
                    find: users[0]['value']
                }
            }).then((response) => {
                if (response.data.length === 0) {
                    handlechatInfo(ChatUsers, '', users[0]['picture'] + sessionStorage.getItem('picture') );
                } else {
                    alert('Ya posee un chat privado con esta persona');
                }
            })
        }
        else if (users.length > 1){

            setShow(false);
            setShow2(true);
            selectedUsers.push(location.state)
            setChatUsers(selectedUsers)
        }
    }
    const handlechatInfo = (chatusers, name, picture) => {
        axios.post('/chat/new', {
            name: name,
            creationTime : new Date().toLocaleTimeString(),
            users: chatusers,
            picture: picture
        });
        setShow2(false);
        window.location.reload()        
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
                    <Modal title="Crear contacto" onClose={() => setShowModal(false)} show={showModal} onSave={() => handleContactInfo()}>
                        <form>
                            <input className="sidebar_searchContainer" placeholder='Introduzca el email del contacto que desea añadir' onChange={e => setInputEmailContact(e.target.value)} value={inputEmailContact}></input>
                        </form>
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
                <Modal title="Enter Group Chat Information" onClose={() => setShow2(false)} show={show2} onSave={() => handlechatInfo(chatUsers, inputName, inputPicture)}>
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