import React, { useState, useEffect, useRef } from "react"; 
import { UserStyle } from "./style";
import { FaPaperclip, FaPaperPlane, FaTrash } from "react-icons/fa"; // Importer l'icône de suppression
import { IoSearch } from "react-icons/io5";
import "./Users.css";
import {Link } from "react-router-dom";
import axios from "axios";
import logo from "../../assets/40138-removebg-preview.png";

export default function Chat() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const chatRef = useRef(null);

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/all_users");
            const data = response.data;
            setUsers(data);
        } catch (error) {
            console.error("Erreur lors de la récupération des utilisateurs :", error);
        }
    };

    useEffect(() => {
        fetchUsers();
        const interval = setInterval(fetchUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const renderMessageContent = (msg) => {
        if (msg.type === "text") {
            return msg.text;
        } else if (msg.type === "image") {
            return <img src={msg.fileUrl} alt="sent" style={{ width: "200px", height: "auto" }} />;
        } else {
            const fileUrl = URL.createObjectURL(msg.file);
            const fileName = msg.file.name;
            const fileExtension = fileName.split('.').pop().toLowerCase();

            if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
                return <a href={fileUrl} download style={{ color: "blue", textDecoration: "underline" }}>{fileName}</a>;
            } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
                return <img src={fileUrl} alt={fileName} style={{ width: "200px", height: "100%" }} />;
            } else {
                return <span style={{ color: "red" }}>Unsupported file type</span>;
            }
        }
    };

    const formatTime = (date) => {
        return `${date.getHours()}:${date.getMinutes() < 10 ? '0' : ''}${date.getMinutes()}`;
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = { text: message, type: "text", sender: "You", time: new Date() };
            setMessages(prevMessages => [...prevMessages, newMessage]);
            setMessage("");
        }
    };

    const handleSendFile = () => {
        if (selectedFile) {
            const newFileMessage = { file: selectedFile, type: "file", sender: "You", time: new Date() };
            setMessages(prevMessages => [...prevMessages, newFileMessage]);
            setSelectedFile(null);
        }
    };

    const handleDeleteMessage = (index) => {
        setMessages(prevMessages => prevMessages.filter((_, i) => i !== index));
    };

    return (
        <div style={UserStyle.Container} className="Poppins">
            <div className="center">
                <div className="contacts">
                    <h2>Contacts</h2>
                    <div className="search-bar">
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Rechercher des utilisateurs..."
                        />
                        <IoSearch />
                    </div>
                    <div className="contact_container">
                        {users.length === 1 ? (
                            <p style={{ color: "red", fontWeight: "bold" }}>Vous êtes seul pour l'instant !</p>
                        ) : users.length === 0 ? (
                            <p style={{ color: "red", fontWeight: "bold" }}>Aucun utilisateur trouvé !</p>
                        ) : (
                            users.filter(user => user.name.toLowerCase().includes(search.toLowerCase())).map((user) => (
                                <div className="contact" key={user.id}>
                                    <Link to="/chat/"key={user.id}>
                                    <div className="pic" style={{ backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover'}} />
                                </Link>
                                    <p style={{ fontWeight: "bold", color: "black"}}>{user.name}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="chat" style={{textAlign: "center"}}>

                    <h1>Chat</h1>
                    {/* <div className="bar">
                        <div className="pic" style={{ backgroundImage: `url(${logo})`, backgroundSize: 'cover' }} />
                        <div className="name">Static Chat</div>
                        <div className="seen">Seen 2m ago</div>
                    </div>

                    <div id="chat" ref={chatRef} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`message ${msg.type} ${msg.sender === "You" ? "sender" : "receiver"}`}>
                                {renderMessageContent(msg)}
                                <div className="message-time">{formatTime(msg.time)}</div>
                                <FaTrash 
                                    style={{ cursor: "pointer", color: "red", marginLeft: "10px" }} 
                                    onClick={() => handleDeleteMessage(index)} 
                                />
                            </div>
                        ))}
                    </div>

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
                    </div> */}
                </div>
            </div>
        </div>
    );
}
