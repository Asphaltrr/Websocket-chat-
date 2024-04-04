// src/WebSocketClient.js

import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";
import { Alert, Form, InputGroup } from "react-bootstrap";
import ClientConnected from "../clientConnected/clientConnected";
import { IoIosLaptop } from "react-icons/io";
import { HiChatAlt2 } from "react-icons/hi";
import { BiLogoTelegram } from "react-icons/bi";
import { FaUser } from "react-icons/fa";
import AvatarSelector from "../avatarSelector/avatarSelector";

function WebSocketClient() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [clients, setClients] = useState([]);
  const [isNameSet, setIsNameSet] = useState(false);
  const [avatar, setAvatar] = useState(""); // Nouvel état pour l'avatar
  // Supposons que vous récupériez l'ID de l'utilisateur d'une certaine manière
  const [userId, setUserId] = useState("user123");
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);
  const [showClients, setShowClients] = useState(false);




  const avatarColors = {
    "/avatar1.jpg": "#8DC7FF",
    "/avatar2.jpg": "#E28DFF",
    "/avatar3.jpg": "#FF8DFD",
    "/avatar4.jpg": "#FFFF8D",
    "/avatar5.jpg": "#FFE08D",
    "/avatar6.jpg": "#95FFFB",
    "/avatar7.jpg": "#FF85C6",
    "/avatar9.jpg": "#85FF9A",
    // Ajoutez autant d'entrées que nécessaire pour vos avatars
  };

  useEffect(() => {
    // Établissement de la connexion WebSocket
    const socket = new WebSocket("ws://localhost:8080");
    setWs(socket);

    socket.onopen = () => {
      // Demander la liste des clients connectés
      socket.send(JSON.stringify({ type: "requestClientList" }));
    };  
  
    // Gestion des messages entrants
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
  
      // Mise à jour des messages
      if (data.type === "messages") {
        const updatedMessages = data.messages.map((msg) => ({
          ...msg,
          isMine: msg.senderId === userId, // Marquer si le message est le nôtre
        }));
        setMessages(updatedMessages);
      }
      // Mise à jour de la liste des clients connectés
      else if (data.type === "clientList") {
        setClients(data.clients);
      }
    };
  
    // Nettoyage en cas de démontage du composant
    return () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        socket.close(); // Fermeture de la connexion WebSocket
      }
    };
  }, []); // Le tableau de dépendances vide signifie que cet effet s'exécute une seule fois après le montage initial
  

  const sendName = () => {
    if (ws && name && avatar) {
      // Supposons que vous obteniez l'ID de l'utilisateur ici
      const myUserId = "user123"; // Remplacez ceci par la logique appropriée pour obtenir l'ID de l'utilisateur
      setUserId(myUserId);
      ws.send(
        JSON.stringify({ type: "setName", name, avatar, userId: myUserId })
      );
      setIsNameSet(true);
    }
  };
  const sendMessage = (e) => {
    e.preventDefault(); // Empêche le rafraîchissement de la page

    if (ws && ws.readyState === WebSocket.OPEN && name && input) {
      ws.send(JSON.stringify({ type: "message", name, message: input }));
      setInput(""); // Réinitialise le champ de saisie après l'envoi du message
    } else {
      console.log("Connexion WebSocket non établie.");
    }
  };

  const handleAvatarSelect = (selectedAvatar) => {
    setAvatar(selectedAvatar);
  };

  useEffect(() => {
    // ...
    console.log(clients); // Pour déboguer
  }, [clients]);

  useEffect(() => {
    if (isNameSet && ws) {
      ws.send(JSON.stringify({ type: "getMessages" }));
    }
  }, [isNameSet, ws]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const Loader = ({ isHidden }) => (
    <div className={`loader ${isHidden ? 'hidden' : ''}`}>
    </div>
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setHideLoader(true); // Commence la transition
      setTimeout(() => setImagesLoaded(true), 1000); // Attendez la fin de la transition pour cacher le loader
    }, 3000);
  
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: "logout", userId }));
    }
  
    setIsNameSet(false);
    setName('');
    setAvatar('');
    // Réinitialiser d'autres états au besoin
  };
  
  
  const toggleClientsList = () => {
    setShowClients(prevShowClients => !prevShowClients);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showClients && !event.target.closest('.client-list')) {
        setShowClients(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
  
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showClients]);

  return (
    <div>
     {!imagesLoaded && (
      <Loader isHidden={hideLoader} />
    )}


      <div className="content">

      {!isNameSet && (
        <div className="welcomeContainer">
              {imagesLoaded && (
          <div className="welcome">
            <h1>
              Bienvenue <HiChatAlt2 />
            </h1>
            <h6>Entrez votre pseudo pour commencer à discuter</h6>

            <AvatarSelector
              onSelect={handleAvatarSelect}
              className="avatarSelector"
            />

            <InputGroup
              placeholder="Entrez votre pseudo"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mb-3"
            >
              <Form.Control
                placeholder="Entrer votre pseudo"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
              />
              <Button
              className="formButton"
                onClick={sendName}
          
              >
                se connecter
              </Button>
            </InputGroup>
            <h6>Clients connectés</h6>

            <ClientConnected>
              <div className="client-list welcomeClient-connected">
                {clients.map((client, index) => (
                  <span key={index}>
                    {client.name}{" "}
                    <img
                      src={client.avatar}
                      alt={`Avatar de ${client.name}`}
                      style={{
                        width: "20px",
                        height: "20px",
                        borderRadius: "50%",
                      }}
                    />
                  </span>
                ))}
              </div>
            </ClientConnected>
          

          </div>
              )}
        </div>
      )}

      {isNameSet && (
        <div className="messageContainer">
          <div className="messageUi">
          <div className="message">
            <div className="header-conversation">
              
              <h1>
                {avatar && (
                  <img
                    src={avatar}
                    alt="Avatar sélectionné"
                    style={{ width: "42px", height: "42px", borderRadius: "50%"}}
                  />
                )}
                {name}
              </h1>
              <button onClick={toggleClientsList} className="userButton">
                
              </button>
              <button onClick={handleLogout} className="quitButton">
                
              </button>
              <ClientConnected>
                <div className={`client-list clientConnecteMessage afficheClientConnecté ${showClients ? 'visible' : 'hidden'}`}>
                  {clients.map((client, index) => (
                    <span key={index}>
                      {client.name}{" "}
                      <img
                        src={client.avatar}
                        alt={`Avatar de ${client.name}`}
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                        }}
                      />
                    </span>
                  ))}
                </div>
              </ClientConnected>
            </div>
            
            
            <ul className="message-list">
              {messages.map((msg, idx) => (
                <li
                  key={idx}
                  className={`message-item ${
                    msg.name === name ? "sent-message" : "received-message"
                  }`}
                >
                  <div className="liPic">
                    {msg.name !== name && (
                      <img
                        src={msg.avatar}
                        alt={`${msg.name}'s avatar`}
                        className="message-avatar"
                      />
                    )}
                  </div>
                  <span
                    className={`message-text ${
                      msg.name === name ? "sent-message" : "received-message"
                    }`}
                  >
                    <span style={{display:"flex", flexDirection:"column"}}>
                      <span
                        style={{
                          color: avatarColors[msg.avatar] || "defaultColor",
                        }}
                      >
                        {msg.name !== name && `~ ${msg.name} `}
                      </span>
                      <span>{msg.message}</span>
                    </span>
                  </span>
                </li>
              ))}
              <div ref={messagesEndRef} />
            </ul>

            <form className="formform" onSubmit={sendMessage}>
              <input
                onChange={(e) => setInput(e.target.value)}
                type="text"
                name="text"
                className="inputMessage"
                placeholder="votre message"
                value={input}
              />
              <button
                className="buttonSentMessage"
                id="button-addon2"
                type="submit"
              >
                <BiLogoTelegram />
              </button>
            </form>
          </div>
          </div>
        </div>
      )}</div>

    </div>
  );
}

export default WebSocketClient;
