import React, { useState, useEffect, useRef } from "react"; 
import axios from "axios";
import { UserStyle } from "../Users/style";
import { IoSearch } from "react-icons/io5";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { format } from 'date-fns';
import "../ChatInterface/Chat.css";

export default function GroupChat() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [memberCount, setMemberCount] = useState(null);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const chatRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            console.error('Invalid date:', dateString);
            return 'Date invalide';
        }
        return format(date, 'dd/MM/yyyy HH:mm');
    };

    useEffect(() => {
        const fetchGroups = async () => {
            const userId = localStorage.getItem("UserId");
            try {
                const response = await axios.post('http://192.168.1.138:8000/api/SelectGroups', { member_id: userId });
                setGroups(response.data.groups); 
            } catch (error) {
                console.error("Erreur lors de la récupération des groupes:", error);
            }
        };
        fetchGroups();
    }, []);

    const handleGroupSelect = async (group) => {
        setSelectedGroup(group);
        setMessages([]);
        await fetchMessages(group.id); // Charger les messages dès qu'un groupe est sélectionné
    };

    const fetchMessages = async (groupId) => {
        try {
            const response = await axios.post('http://192.168.1.138:8000/api/getGroupMessages', { group_id: groupId });
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Erreur lors de la récupération des messages du groupe:", error);
        }
    };

    useEffect(() => {
        let intervalId; // Variable pour stocker l'ID de l'intervalle
        if (selectedGroup) {
            fetchMessages(selectedGroup.id); // Charger les messages initialement
            intervalId = setInterval(() => {
                fetchMessages(selectedGroup.id); // Mettre à jour les messages toutes les 4 secondes
            }, 4000);
        }

        // Nettoyer l'intervalle lorsque le groupe sélectionné change ou le composant se démonte
        return () => {
            clearInterval(intervalId);
        };
    }, [selectedGroup]); // Dépendance au groupe sélectionné

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        const newMessage = {
            group_id: selectedGroup.id,
            sender_id: localStorage.getItem("UserId"),
            message,
        };

        await axios.post('http://192.168.1.138:8000/api/SendMessageGroup', newMessage);
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessage("");
        scrollToBottom(); 
    };

    const handleSendFile = async () => {
        if (!selectedFile) return;

        const formData = new FormData();
        formData.append("group_id", selectedGroup.id);
        formData.append("sender_id", localStorage.getItem("UserId"));
        formData.append("message", "Fichier partagé");
        formData.append("file", selectedFile);

        try {
            const response = await axios.post('http://192.168.1.138:8000/api/SendMessageGroup', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessages(prevMessages => [...prevMessages, response.data.data]);
            setSelectedFile(null);
            scrollToBottom(); 
        } catch (error) {
            console.error("Erreur lors de l'envoi du fichier:", error);
        } 
    };

    const MemberCount = async () => {
        try {
            const response = await axios.post('http://192.168.1.138:8000/api/countMembers', { 
                group_id: selectedGroup.id 
            });
            setMemberCount(response.data.count);
        } catch (error) {
            console.error("Erreur lors de la récupération du nombre de membres du groupe:", error);
        }
    };

    const scrollToBottom = () => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    };

    const filteredGroups = groups.filter(group => 
        group.name.toLowerCase().includes(search.toLowerCase())
    );

    useEffect(() => {
        if (selectedGroup) {
            MemberCount();
        }
    }, [selectedGroup]);

  
  

    return (
        <div style={UserStyle.Container} className="Poppins">
            <div className="center">
                {/* Contacts Section */}
                <div className="contacts">
                    <h2>Groupes</h2>
                    <div className="search-bar">
                        <input 
                            type="text" 
                            value={search} 
                            onChange={(e) => setSearch(e.target.value)} 
                            placeholder="Rechercher des groupes..."
                            aria-label="Rechercher des groupes"
                        />
                        <IoSearch />
                    </div>
                    <div className="contact_container" style={{ position: "relative" }}>
                        {filteredGroups.map(group => (
                            <div 
                                key={group.id} 
                                className={`contact ${selectedGroup?.id === group.id ? 'active' : ''}`} 
                                onClick={() => handleGroupSelect(group)} 
                                style={{ cursor: "pointer", padding: '10px', borderBottom: '1px solid #ccc' }}
                            >
                                <div className="pic" 
                                     style={{ 
                                         width: '40px', 
                                         height: '40px', 
                                         backgroundImage: `url(http://192.168.1.138:8000/uploads/${group.avatar})`,
                                         backgroundSize: 'cover', 
                                         borderRadius: '50%', 
                                         marginRight: '10px' 
                                     }} 
                                />
                                <p style={{ fontWeight: "bold", color: "black" }}>{group.name}</p>
                            </div>
                        ))}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                        <a href="/chat">retour</a>
                        <a href="/createGroup" title="Creer un nouveau groupe">Creer</a>
                    </div>
                </div>

                {/* Chat Section */}
                <div className="chat">
                    {selectedGroup ? (
                        <>
                            <div className="bar" style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                                <a href={`/GroupDetails/${selectedGroup.id}`}>
                                    <div className="group-pic" 
                                         style={{ 
                                             width: '40px', 
                                             height: '40px', 
                                             backgroundImage: `url(http://192.168.1.138:8000/uploads/${selectedGroup.avatar })`, 
                                             backgroundSize: 'cover', 
                                             borderRadius: '50%', 
                                             marginRight: '10px' 
                                         }} 
                                    /> 
                                </a>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <div className="name" style={{ fontWeight: 'bold', marginRight: '10px' }}>{selectedGroup.name}</div>
                                    <a href={`/addMember/${selectedGroup.id}`}>
                                        <FaCirclePlus size={40} />
                                    </a>
                                </div>
                            </div>
                            
                            <h6>{memberCount} membres</h6>

                            {/* Messages window */}
                            <div id="chat" ref={chatRef} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${msg.sender_id != localStorage.getItem("UserId") ? "" : "sender"}` } 
                                        style={{
                                            display: 'flex', flexDirection: 'column'
                                        }}
                                    >
                                        {msg.file ? (
                                            <div className="file-message" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '10px'}}>
                                                {msg.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                                                    <div style={{ marginRight: '10px' }}>
                                                        <img 
                                                            src={`http://192.168.1.138:8000/uploads/sendGroupFile/${msg.file}`} target="_blank" 
                                                            alt="preview" 
                                                            style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} 
                                                        />
                                                    </div>
                                                ) : (
                                                    <div style={{ marginRight: '10px' }}>
                                                        <FaPaperclip size={30} style={{ color: '#555' }} />
                                                    </div>
                                                )}
                                                <div>
                                                    <a 
                                                        href={`http://192.168.1.138:8000/uploads/sendGroupFile/${msg.file}`} target="_blank" 
                                                        download={msg.file}
                                                        style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}
                                                    >
                                                        {msg.file}
                                                    </a>
                                                </div>
                                            </div>
                                        ) : (
                                            <p style={{ background: msg.sender_id === localStorage.getItem("UserId") ? '#e1ffc' : '' , borderRadius: '10px' }} >
                                                {msg.message}
                                            </p>
                                        )}
                                        <span style={{ fontSize: '0.8em', color: '#555' }} >
                                            {formatDate(msg.created_at)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Input and send button */}
                            <div className="input">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder="Tapez un message..."
                                    aria-label="Champ de saisie de message"
                                />
                                <div onClick={handleSendMessage} style={{ cursor: "pointer", color: "blue" }}>
                                    <FaPaperPlane />
                                </div>
                                <input
                                    type="file"
                                    onChange={(e) => setSelectedFile(e.target.files[0])}
                                    style={{ display: "none" }} 
                                    id="file-input"
                                    aria-label="Sélectionner un fichier"
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
                        <p style={{ fontWeight: 'bold' }}>Sélectionnez un groupe pour démarrer une conversation</p>
                    )}
                </div>
            </div>
        </div>
    );
}
