import { React, useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from "./axios";
import { useNavigate } from "react-router-dom";

import "./login.css";

function App() {
  let nav = useNavigate();

  useEffect(() => {
    /*global google*/
    function handleCallbackResponse(response) {
      const person = jwt_decode(response.credential);

      axios
        .get("/user/login", {
          params: {
            email: `${person.email}`,
          },
        })
        .then((res) => {
          if (res.data.length === 0) {
            axios.post("/user/new", {
              email: person.email,
              email_verified: person.email_verified,
              name: person.name,
              picture: person.picture,
            });
          }
          sessionStorage.setItem("picture", person.picture);
          sessionStorage.setItem("name", person.name);
          // Que me redirija a la página del chat, y lleve las informaciones del usuario
          nav("/chat", { state: `${person.email}` });
        });
    }

    google.accounts.id.initialize({
      client_id:
        "506098763641-1m2pfrsglfatggtass4uja8mdjkobd2j.apps.googleusercontent.com",
      callback: handleCallbackResponse,
    });

    google.accounts.id.renderButton(document.getElementById("SignInDiv"), {
      theme: "filled_blue",
      size: "large",
      shape: "pill",
    });

    google.accounts.id.prompt();
  }, [nav]);

  return (
    <div className="login">
      <div className="main">
        <h1>Login</h1>
        <div id="SignInDiv"></div>
      </div>
    </div>
  );
}

export default App;
