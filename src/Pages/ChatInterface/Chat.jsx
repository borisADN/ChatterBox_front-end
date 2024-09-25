import React, { useState, useEffect, useRef } from "react"; 
import { UserStyle } from "./style";
import {Link} from "react-router-dom"
import { FaArrowAltCircleRight, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { HiMiniUsers } from "react-icons/hi2"
import { BsPlusCircleFill } from "react-icons/bs";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import "./Chat.css";

export default function Chat() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);

    // Fetch users
    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/all_users");
            setUsers(response.data);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
    };

    // Fetch messages for the selected user
    const fetchMessages = async () => {
        const outgoing_msg_id = localStorage.getItem("UserId");
        const incoming_msg_id = selectedUser.id;

        try {
            const response = await axios.post("http://localhost:8000/api/getMessage", {
                outgoing_msg_id,
                incoming_msg_id,
            });
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Erreur lors de la récupération des messages :", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(); 
            const messageInterval = setInterval(fetchMessages, 5000);
            return () => clearInterval(messageInterval); 
        }
    }, [selectedUser]);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    // Handle message sending
    const handleSendMessage = async () => {
        if (message.trim() && selectedUser) {
            const outgoing_msg_id = localStorage.getItem("UserId");
            const newMessage = { 
                outgoing_msg_id, 
                incoming_msg_id: selectedUser.id, 
                message, 
                file: null 
            };

            try {
                await axios.post("http://localhost:8000/api/sendMessage", newMessage);
                setMessages(prevMessages => [...prevMessages, { ...newMessage, time: new Date() }]);
                setMessage(""); 
            } catch (error) {
                console.error("Erreur lors de l'envoi du message :", error);
            }
        }
    };

    // Handle file sending
    const handleSendFile = async () => {
        if (selectedFile && selectedUser) {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('outgoing_msg_id', localStorage.getItem("UserId"));
            formData.append('incoming_msg_id', selectedUser.id);

            try {
                const response = await axios.post("http://localhost:8000/api/sendFile", formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                
                const newFileMessage = { 
                    outgoing_msg_id: localStorage.getItem("UserId"),
                    incoming_msg_id: selectedUser.id,
                    message: "Envoyé",
                    file: response.data.file, // Assurez-vous que l'API renvoie le nom du fichier
                    time: new Date()
                };
                setMessages(prevMessages => [...prevMessages, newFileMessage]);
                setSelectedFile(null);
            } catch (error) {
                console.error("Erreur lors de l'envoi du fichier :", error.message);
            }
        }
    };

    // Handle user selection
    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setMessages([]); 
        fetchMessages();
    };

    return (
        <div style={UserStyle.Container} className="Poppins">
            <div className="center">
                {/* Contacts Section */}
                <div className="contacts">
                    {/* insert here an example image for current user profile */}
                        {/* <img src="https://th.bing.com/th/id/R.3770fed44a56e4f939bd93f07912b461?rik=03hW0KESDYUJzA&riu=http%3a%2f%2fimg.bleacherreport.net%2fimg%2fimages%2fphotos%2f002%2f105%2f204%2fhi-res-159596853_crop_exact.jpg%3fw%3d1500%26h%3d1500%26q%3d85&ehk=fbxOupAgjVzLayWE%2ba%2bdh30dosBHN%2bkAlZBSL9dUcvE%3d&risl=&pid=ImgRaw&r=0" alt="User Profile" style={{ borderRadius: "50%", width: "40px", height: "40px" }} /> */}
                    <div className="profile">
                        {/* insert here an example image for current user profile */}
                    </div>
                    
                    <h2>Contacts</h2>
                    {/* <a href="">Mes Groupes</a>  */}
                    <div className="search-bar">
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Rechercher des utilisateurs..."
                        />
                        <IoSearch />
                    </div>
                
                    <div className="contact_container" style={{position: "relative"}}>
                    {users.length === 1 ? (
                            <p style={{ color: "red", fontWeight: "bold" }}>Vous êtes seul pour l'instant !</p>
                        ) : users.length === 0 ? (
                            <p style={{ color: "red", fontWeight: "bold" }}>Aucun utilisateur trouvé !</p>
                        ) : (
                            users.filter(user => user.name.toLowerCase().includes(search.toLowerCase())).map((user) => (
                                <div className={`contact ${selectedUser && selectedUser.id === user.id ? "active" : ""}`} key={user.id} onClick={() => handleUserSelect(user)}>
                               
                                    <div className="pic" style={{ backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover'}} />
                   
                                    <p style={{ fontWeight: "bold", color: "black"}}>{user.name}</p>
                                </div>
                            ))
                        )}
                   {/* bouton flottant pour creer un groupe */}
                    </div>
                    <div style={{textAlign: "center"}} className="group-btn" > 
                    <HiMiniUsers color="blue" />
                        <Link to={"/group"}>Mes Groupes</Link>
                        <FaArrowAltCircleRight  color="blue"/>
                    </div>
                </div>

                {/* Chat Section */}
                <div className="chat">
                    {selectedUser ? (
                        <>
                            <div className="bar">
                                <div className="pic" style={{ backgroundImage: `url(${selectedUser.avatar})`, backgroundSize: 'cover' }} />
                                <div className="name">{selectedUser.name}</div>
                                <h6>{selectedUser.id}</h6>
                            </div>

                            {/* Messages window */}
                            <div id="chat" ref={chatRef} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                                {messages.map((message, index) => (
                                    <div
                                        key={index}
                                        className={`message ${message.outgoing_msg_id === localStorage.getItem("UserId") ? "sender" : ""}`}
                                    >
                                        {message.file ? (
                                            message.file.endsWith('.jpg') || 
                                            message.file.endsWith('.jpeg') || 
                                            message.file.endsWith('.png') || 
                                            message.file.endsWith('.gif') ? (
                        
                                                <img 
                    
                                
                                                    src={`http://localhost:8000/uploads/sendFile/${message.file}`} 
                                                    alt="Fichier envoyé" 
                                                    style={{ maxWidth: '100%', maxHeight: '200px' }} 
                                                />
                                            ) : (
                                                <a href={`http://localhost:8000/uploads/sendFile/${message.file}`} download  target="_blank" rel="noopener noreferrer">
                                                    Fichier: {message.file.split('/').pop()}
                                                </a>
                                            )
                                        ) : (
                                            <p>{message.message}</p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Message input */}
                            <div className="input">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Type a message..."
                                />
                                <div onClick={handleSendMessage} style={{ cursor: "pointer", color: "blue" }}>
                                    <FaPaperPlane />
                                </div>
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    style={{ display: "none" }} 
                                    id="file-input"
                                />
                                <label htmlFor="file-input" style={{ cursor: "pointer", color: "blue" }}>
                                    <FaPaperclip />
                                </label>
                                <div
                                    onClick={handleSendFile}
                                    style={{ cursor: "pointer", color: selectedFile ? "blue" : "gray" }}
                                >
                                    <FaPaperPlane />
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="no-user-selected">
                            <p>Sélectionnez un contact pour démarrer une conversation</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
