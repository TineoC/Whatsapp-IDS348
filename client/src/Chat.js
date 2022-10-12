import React, { Fragment, useEffect, useState, useRef } from "react";
import "./Chat.css";
import { Avatar, IconButton } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import axios from "./axios";
import { useLocation, useParams } from "react-router-dom";
import InputEmoji from "react-input-emoji";
import { Image } from "cloudinary-react";

function Chat({ messages }) {
  const location = useLocation();
  const userName = sessionStorage.getItem("name");

  const [input, setInput] = useState("");

  const [image, setImage] = useState(null);

  let { id } = useParams();

  const sendMessage = async () => {
    if (input !== "") {
      // solo hay texto
      if (image) uploadImage(image);

      await axios.post("/messages/new", {
        message: input,
        imgURL: "",
        name: userName,
        timestamp: new Date().toLocaleTimeString("default", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        chat: id,
      });
    }

    if (image) {
      // solo hay imagen

      await uploadImage(image);
    }

    setInput("");
    setImage(null);
  };

  const [chat, setChat] = useState([]);
  useEffect(() => {
    axios
      .get("/chat/search", {
        params: {
          _id: `${id}`,
        },
      })
      .then((response) => {
        var div = document.getElementById("chat_header");
        div.style.visibility = "visible";
        setChat(response.data);
      });
  }, [id]);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const uploadImage = () => {
    const formData = new FormData();

    formData.append("file", image);
    formData.append("upload_preset", "IDS348-whatsapp");
    formData.append("cloud_name", "diofidb5j");

    fetch("https://api.cloudinary.com/v1_1/diofidb5j/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then(async (result) => {
        console.log(result);
        console.log(result.url);

        await axios.post("/messages/new", {
          message: "",
          imgURL: result.url,
          name: userName,
          timestamp: new Date().toLocaleTimeString("default", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          chat: id,
        });
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="chat">
      <div id="chat_header" className="chat_header">
        {chat.length !== 0 && (
          <div>
            <Avatar
              src={chat[0]?.picture.replace(
                sessionStorage.getItem("picture"),
                ""
              )}
            ></Avatar>
          </div>
        )}
        {chat.length !== 0 && (
          <div className="chat_headerInfo">
            {chat[0]?.name === "" && (
              <h3>
                {chat[0]?.users
                  .toString()
                  .replace(",", "")
                  .replace(`${location.state}`, "")}
              </h3>
            )}
            {chat[0]?.name !== "" && <h3>{chat[0]?.name}</h3>}
          </div>
        )}
        {chat.length !== 0 && (
          <div className="chat_headerRight">
            <IconButton>
              <SearchIcon />
            </IconButton>
          </div>
        )}
      </div>
      <div className="chat_body">
        {messages.map((message) => (
          <p
            key={message._id}
            className={`chat_message ${
              message.name === sessionStorage.getItem("name") && "chat_receiver"
            }`}
          >
            {" "}
            {/*Para hacer la lógica de autenticación tengo que revisar si el nombre del usuario que envió el mensaje es cual o quién e igual concatenarle lo e receiver*/}
            <span className="chat_name">{message.name}</span>
            {message.message}
            {message.imgURL && (
              <Image
                style={{ width: 200 }}
                cloudName="diofidb5j"
                publicId={message.imgURL}
              />
            )}
            <span ref={ref} className="chat_timestamp">
              {message.timestamp}
            </span>
          </p>
        ))}
      </div>
      <div className="chat_footer">
        {id !== undefined && (
          <div>
            <InputEmoji
              value={input}
              onChange={setInput}
              cleanOnEnter
              onEnter={sendMessage}
              placeholder="Type a message"
            />

            <Fragment>
              <input
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
                accept="image/*"
                id="icon-button-photo"
                type="file"
                hidden={true}
              />
              <label htmlFor="icon-button-photo">
                <IconButton component="span">
                  <AttachFileIcon />
                </IconButton>
              </label>
            </Fragment>

            <IconButton onClick={sendMessage}>
              <SendRoundedIcon />
            </IconButton>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
