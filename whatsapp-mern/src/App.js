import { React, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import axios from "./axios";
import { useNavigate, useParams } from 'react-router-dom'

function App() {
  
  let nav = useNavigate();
  let {nbf} = useParams();
  
  function handleCallbackResponse(response) {
    const person = jwt_decode(response.credential)
    
    axios.get('/user/login', { params: {
      email: `${person.email}`
    }
    }).then(((res) => {
      console.log(res.data)
      if (res.data.length === 0){
        axios.post('/user/new', {
          email: person.email,
          email_verified: person.email_verified,
          name: person.name,
          picture: person.picture,
          id: person.nbf,
        })
      } else {
        nbf = person.nbf.toString()
        sessionStorage.setItem('picture', person.picture)
        sessionStorage.setItem('name', person.name)
        sessionStorage.setItem('nbf', person.nbf)
        sessionStorage.setItem('email', person.email)
        // Que me redirija a la página del chat, y lleve las informaciones del usuario
        nav(`/chat/${nbf}`)
      }
    }))
  }


  useEffect(() => { 
    /*global google*/
    google.accounts.id.initialize({
      client_id: "506098763641-1m2pfrsglfatggtass4uja8mdjkobd2j.apps.googleusercontent.com",
      callback: handleCallbackResponse
    });

    google.accounts.id.renderButton(
      document.getElementById("SignInDiv"),
      {theme: "filled_blue", size: "large", shape: "pill"}
    )

    google.accounts.id.prompt();
  }, []);

  return (
    <div className='App'>
      Login
      <div id='SignInDiv'></div>
    </div>
  )
}

export default App
