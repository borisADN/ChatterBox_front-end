import React, { useState, useEffect, useRef } from "react"; 
import { UserStyle } from "./style";
import { FaPaperclip, FaPaperPlane, FaTrash } from "react-icons/fa"; // Importer l'icône de suppression
import { IoSearch } from "react-icons/io5";
import "./Users.css";
import {Link, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function Chat() {
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [message, setMessage] = useState("");
    const [selectedFile, setSelectedFile] = useState(null);
    const [messages, setMessages] = useState([]);
    const [email, setEmail] = useState("");
    const chatRef = useRef(null);
    const navigate = useNavigate();
    const { groupId } = useParams();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://192.168.1.138:8000/api/AddMember', {
                group_id: groupId,
                email: email,
                sender_id :localStorage.getItem('UserId')
            });
            toast.success('Utilisateur ajoute avec succes');
            navigate('/group');           
        } catch (error) {
            // toast.error('Erreur lors de l\'ajout du membre');
            toast.error('Cet utilisateur fait deja partie du groupe !');
            console.error("Erreur lors de l'ajout du membre :", error);
            // if (error.response) {
            //     toast.error(error.response.data);
            // } else {
            //     console.error("Erreur inconnue :", error);
            // }
        }
    };

    const fetchUsers = async () => {
        try {
            const response = await axios.get("http://192.168.1.138:8000/api/all_users");
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
                                <div className="contact" key={user.id} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                                   
                                    <div className="pic" style={{ backgroundImage: `url(${user.avatar})`, backgroundSize: 'cover'}} />
                            
                                   
                              <div>
                                    <p>{user.email}</p>

                              </div>

                                    <p style={{ fontWeight: "bold", color: "black"}}>{user.name}</p><br />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className="chat" style={{textAlign: "center"}}>
<p>Ajouter un utilisateur</p>
<p>{groupId}</p>
                    <h1>Chat</h1>
                    <form action="" onSubmit={handleSubmit}>

<input type="text" placeholder="renseignez l'email de l'utilisateur" value={email} onChange={(e) => setEmail(e.target.value)} />
<input type="submit" value="Envoyer" />
                    </form>
                    
                </div>
            </div>
        </div>
    );
}
