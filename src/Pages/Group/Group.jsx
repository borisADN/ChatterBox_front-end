import React, { useState, useEffect, useRef } from "react"; 
import axios from "axios"; // Importer axios
import { UserStyle } from "../Users/style";
import { IoSearch } from "react-icons/io5";
import { FaPaperclip, FaPaperPlane } from "react-icons/fa";
import { FaCirclePlus } from "react-icons/fa6";
import { MdManageAccounts } from "react-icons/md";
import "../ChatInterface/Chat.css";

export default function GroupChat() {
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const chatRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const defaultAvatar = 'http://localhost:8000/uploads/default-avatar.png';
    const responseMessages = [
        "Merci pour votre message!",
        "Je suis d'accord avec ce que tu dis.",
        "Que pensez-vous de cela?",
        "C'est une excellente idée!",
        "Je vais réfléchir à ça.",
        "Peut-être devrions-nous en discuter davantage.",
    ];

    // Appel à l'API pour récupérer les groupes de l'utilisateur connecté
    useEffect(() => {
        const fetchGroups = async () => {
            const userId = localStorage.getItem("UserId"); // ID de l'utilisateur connecté

            try {
                const response = await axios.post('http://localhost:8000/api/SelectGroups', { member_id: userId });
                // console.log(response.data.groups.avatar);
                // console.log(groups);
                
                
                setGroups(response.data.groups); // Mettre à jour les groupes récupérés
            } catch (error) {
                console.error("Erreur lors de la récupération des groupes:", error);
            }
        };

        fetchGroups();
    }, []); // Le useEffect est exécuté une seule fois au chargement du composant

    const handleGroupSelect = async (group) => {
        setSelectedGroup(group);
        setMessages([]); // Réinitialiser les messages lorsqu'un groupe est sélectionné

        try {
            const response = await axios.post('http://localhost:8000/api/getGroupMessages', { group_id: group.id });
            console.log(messages.sender_id);
            setMessages(response.data.messages); // Mettre à jour les messages récupérés pour ce groupe
        } catch (error) {
            console.error("Erreur lors de la récupération des messages du groupe:", error);
        }
    };

    const handleSendMessage = async() => {
        if (!message.trim()) return;
        const newMessage = {
            group_id: selectedGroup.id,
            sender_id: localStorage.getItem("UserId"),
            message,
        };

        await axios.post('http://localhost:8000/api/SendMessageGroup', newMessage);
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessage(""); // Réinitialiser le champ de message

        // Scroll to bottom immediately after sending a message
        scrollToBottom(); 

        // Simuler une réponse d'autres membres après un délai
        setTimeout(() => {
            simulateResponse(newMessage);
        }, 1000); // Délai de 1 seconde pour simuler une réponse
    };

 

    const handleSendFile = () => {
        if (!selectedFile) return;

        const newMessage = {
            id: messages.length + 1,
            file: selectedFile.name,
            outgoing_msg_id: localStorage.getItem("UserId"),
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setSelectedFile(null); // Réinitialiser le fichier sélectionné
        
        // Scroll to bottom immediately after sending a file
        scrollToBottom(); 

        // Simuler la réception du fichier par un autre utilisateur après un délai
        setTimeout(() => {
            simulateFileResponse(newMessage);
        }, 1000); // Délai de 1 seconde pour simuler une réponse
    };



    const scrollToBottom = () => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    };

    const filteredGroups = groups.filter(group => 
        group.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div style={UserStyle.Container} className="Poppins">
            <div className="center">
                {/* Contacts Section */}
                <div className="contacts">
                    <h2>Groups</h2>
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
                                className={`contact ${selectedGroup?.id === group.id ? 'active' : ''}`} // Add active class if selected
                                onClick={() => handleGroupSelect(group)} 
                                style={{ cursor: "pointer", padding: '10px', borderBottom: '1px solid #ccc' }}
                            >
                                
                                <div className="pic" 
                                     style={{ 
                                         width: '40px', 
                                         height: '40px', 
                                        //  backgroundImage: `url(${group.avatar})`, 
                                         backgroundImage: `url(http://localhost:8000/uploads/${group.avatar})`,

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
                        <a href="/createGroup">Creer</a>
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
                                         backgroundImage: `url(http://localhost:8000/uploads/${selectedGroup.avatar })`, 
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
                            {/* <h6>{selectedGroup.members.length} Membres</h6> */}

                            {/* Messages window */}
                            <div id="chat" ref={chatRef} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${msg.sender_id === localStorage.getItem("UserId") ? "sender" : ""}`} 
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            margin: '5px 0'
                                        }}
                                    >
                                        {msg.file ? (
                                            <a 
                                                href={`http://localhost:8000/uploads/sendFile/${msg.file}`} 
                                                download={msg.file}
                                                style={{ textDecoration: 'none', color: 'blue' }}
                                            >
                                                {msg.file}
                                            </a>
                                        ) : (
                                            <p>{msg.message}</p>
                                        )}
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
