// import React, { useEffect, useState } from "react";
// import { UserStyle } from "./style";
// import axios from "axios";
// import { IoSearch } from "react-icons/io5";
// import "./Users.css";

// export default function ChatGpt() {
//   const [users, setUsers] = useState([]);
//   const [search, setSearch] = useState("");
//   const [userCount, setUserCount] = useState(0);
//   const [selectedUser, setSelectedUser] = useState(null); // État pour l'utilisateur sélectionné
//   const [messages, setMessages] = useState([
//     // Messages statiques pour l'instant
//     { from: "Steve Rogers", text: "Hello! How's everything going?" },
//     { from: "Tony Stark", text: "I'm working on some new tech!" },
//     { from: "You", text: "That sounds amazing, Tony!" },
//   ]);

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/api/all_users");
//       const data = response.data;
//       setUsers(data);
//       setUserCount(data.length);
//       console.log(data);
//     } catch (error) {
//       console.error("Erreur lors de la récupération des utilisateurs :", error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     const interval = setInterval(fetchUsers, 5000);
//     return () => clearInterval(interval);
//   }, []);

//   const filteredUsers = users.filter(user =>
//     user.name.toLowerCase().includes(search.toLowerCase())
//   );

//   return (
//     <div style={UserStyle.Container} className="Poppins">
//       {/* Si aucun utilisateur n'est sélectionné, afficher la liste des contacts */}
//       {!selectedUser ? (
//         <div className="contacts">
//           <h2>Contacts</h2>
//           <div className="search-bar">
//             <input
//               type="text"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//               placeholder="Rechercher des utilisateurs..."
//             />
//             <IoSearch />
//           </div>
//           <div className="contact_container">
//             {userCount === 1 ? (
//               <p>Vous êtes le seul utilisateur connecté.</p>
//             ) : (
//               filteredUsers.length > 0 ? (
//                 filteredUsers.map((user) => (
//                   <div
//                     className="contact"
//                     key={user.id}
//                     onClick={() => setSelectedUser(user)} // Sélectionner l'utilisateur au clic
//                   >
//                     <div className="pic" style={{ backgroundImage: `url(${user.avatar})` }}></div>
//                     <p style={{ fontWeight: "bold", color: "black" }}>{user.name}</p>
//                   </div>
//                 ))
//               ) : (
//                 <p style={{ color: "red", fontWeight: "bold" }}>Aucun utilisateur trouvé !</p>
//               )
//             )}
//           </div>
//         </div>
//       ) : (
//         // Si un utilisateur est sélectionné, afficher la vue du chat
//         <div className="chat-container">
//           <h2>Chat avec {selectedUser.name}</h2>
//           <div className="messages">
//             {messages.map((msg, index) => (
//               <div key={index} className={`message ${msg.from === "You" ? "sent" : "received"}`}>
//                 <p><strong>{msg.from}:</strong> {msg.text}</p>
//               </div>
//             ))}
//           </div>
//           <div className="message-input">
//             <input type="text" placeholder="Tapez votre message..." />
//             <button>Envoyer</button>
//           </div>
//           <button onClick={() => setSelectedUser(null)}>Retour aux contacts</button>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState } from "react";
import { IoPaperPlane, IoMic } from "react-icons/io5";
import "./Chat.css"; // J'ai regroupé les styles CSS ici

export default function ChatInterface() {
  const [selectedUser, setSelectedUser] = useState({
    name: "Tony Stark",
    img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/7/73/SMH_Mentor_6.png",
  });

  const [messages, setMessages] = useState([
    { text: "Hey, are you coming to the meeting?", sender: "other" },
    { text: "Yeah, I'll be there in 5 minutes.", sender: "parker" },
    { text: "Alright, see you there!", sender: "other" },
  ]);

  const [newMessage, setNewMessage] = useState("");

  const contacts = [
    {
      name: "Steve Rogers",
      img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/7/7c/Cap.America_%28We_Don%27t_Trade_Lives_Vision%29.png",
    },
    {
      name: "Tony Stark",
      img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/7/73/SMH_Mentor_6.png",
    },
    {
      name: "Bruce Banner",
      img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/4/4f/BruceHulk-Endgame-TravelingCapInPast.jpg",
    },
    {
      name: "Thor Odinson",
      img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/9/98/ThorFliesThroughTheAnus.jpg",
    },
    {
      name: "Carol Danvers",
      img: "https://vignette.wikia.nocookie.net/marvelcinematicuniverse/images/0/05/HeyPeterParker.png",
    },
  ];

  const handleContactClick = (contact) => {
    setSelectedUser(contact);
    setMessages([{ text: `You are now chatting with ${contact.name}.`, sender: "system" }]);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { text: newMessage, sender: "parker" }]);
      setNewMessage("");
    }
  };

  return (
    <div className="center">
      {/* Contacts Section */}
      <div className="contacts">
        <h2>Contacts</h2>
        <div className="contact_container">
          {contacts.map((contact, index) => (
            <div className="contact" key={index} onClick={() => handleContactClick(contact)}>
              <div className="pic" style={{ backgroundImage: `url(${contact.img})` }}></div>
              <div className="name">{contact.name}</div>
              {contact.badge && <div className="badge">{contact.badge}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Section */}
      <div className="chat">
        <div className="bar">
          <div className="pic" style={{ backgroundImage: `url(${selectedUser.img})` }}></div>
          <div className="name">{selectedUser.name}</div>
          <div className="seen">Seen 2m ago</div>
        </div>

        <div id="chat">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.sender === "parker" ? "parker" : ""}`}>
              {message.text}
            </div>
          ))}
        </div>

        <div className="input">
          <input
            type="text"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <IoPaperPlane className="icon" onClick={handleSendMessage} />
          <IoMic className="icon" />
        </div>
      </div>
    </div>
  );
}

