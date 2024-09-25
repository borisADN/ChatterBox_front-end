import React, { useState, useEffect, useRef } from "react"; 
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
    const responseMessages = [
        "Merci pour votre message!",
        "Je suis d'accord avec ce que tu dis.",
        "Que pensez-vous de cela?",
        "C'est une excellente idée!",
        "Je vais réfléchir à ça.",
        "Peut-être devrions-nous en discuter davantage.",
    ];

    // Simulation des données des groupes
    useEffect(() => {
        const fetchGroups = async () => {
            const fetchedGroups = [
                { id: 1, name: "Groupe 1", members: ["Alice", "Bob", "Charlie"], image: "https://via.placeholder.com/150/FF5733/FFFFFF?text=Groupe+1" },
                { id: 2, name: "Groupe 2", members: ["David", "Eve"], image: "https://via.placeholder.com/150/33FF57/FFFFFF?text=Groupe+2" },
                { id: 3, name: "Groupe 3", members: ["Frank", "Grace", "Heidi", "Ivan"], image: "https://via.placeholder.com/150/3357FF/FFFFFF?text=Groupe+3" },
                { id: 4, name: "Groupe 4", members: ["Jack", "Kate", "Lisa"], image: "https://via.placeholder.com/150/FF33A5/FFFFFF?text=Groupe+4" },
                { id: 5, name: "Groupe 5", members: ["Mary", "Nancy", "Olivia"], image: "https://via.placeholder.com/150/F3FF33/FFFFFF?text=Groupe+5" },
                { id: 6, name: "Groupe 6", members: ["Paul", "Quincy", "Rachel"], image: "https://via.placeholder.com/150/FF33F6/FFFFFF?text=Groupe+6" },
            ];
            setGroups(fetchedGroups);
        };

        fetchGroups();
    }, []);

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
        setMessages([]); // Réinitialiser les messages lorsqu'un groupe est sélectionné
    };

    const handleSendMessage = () => {
        if (!message.trim()) return;
        const newMessage = {
            id: messages.length + 1,
            message,
            outgoing_msg_id: localStorage.getItem("UserId"),
        };
        setMessages(prevMessages => [...prevMessages, newMessage]);
        setMessage(""); // Réinitialiser le champ de message

        // Scroll to bottom immediately after sending a message
        scrollToBottom(); 

        // Simuler une réponse d'autres membres après un délai
        setTimeout(() => {
            simulateResponse(newMessage);
        }, 1000); // Délai de 1 seconde pour simuler une réponse
    };

    const simulateResponse = (sentMessage) => {
        const randomMemberIndex = Math.floor(Math.random() * selectedGroup.members.length);
        const memberName = selectedGroup.members[randomMemberIndex];
        const responseMessage = {
            id: messages.length + 2, // Assure que l'ID est unique
            message: `${memberName}: ${responseMessages[Math.floor(Math.random() * responseMessages.length)]}`,
            outgoing_msg_id: null, // Indique que c'est un message entrant
        };

        // Ajoute le message de réponse à la liste des messages
        setMessages(prevMessages => [...prevMessages, responseMessage]);
        
        // Scroll to bottom after adding a new incoming message
        scrollToBottom();
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

    const simulateFileResponse = (sentMessage) => {
        const randomMemberIndex = Math.floor(Math.random() * selectedGroup.members.length);
        const memberName = selectedGroup.members[randomMemberIndex];
        const responseMessage = {
            id: messages.length + 2, // Assure que l'ID est unique
            file: `${memberName}_file.txt`, // Nom du fichier simulé
            outgoing_msg_id: null, // Indique que c'est un message entrant
        };

        // Ajoute le message de réponse à la liste des messages
        setMessages(prevMessages => [...prevMessages, responseMessage]);
        
        // Scroll to bottom after adding a new incoming file message
        scrollToBottom();
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
                                         backgroundImage: `url(${group.image || 'path/to/default-image.jpg'})`, 
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
                                <a href="/GroupDetails">
                                <div className="group-pic" 
                                     style={{ 
                                         width: '40px', 
                                         height: '40px', 
                                         backgroundImage: `url(${selectedGroup.image || 'path/to/default-image.jpg'})`, 
                                         backgroundSize: 'cover', 
                                         borderRadius: '50%', 
                                         marginRight: '10px' 
                                     }} 
                                /> 
                                </a>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                                    <div className="name" style={{ fontWeight: 'bold', marginRight: '10px' }}>{selectedGroup.name}</div>
                                     <a href = "/addMember">
                                     <FaCirclePlus size={40} />

                                     </a>
                                </div>
                            </div>
                            <h6>{selectedGroup.members.length} Membres</h6>

                            {/* Messages window */}
                            <div id="chat" ref={chatRef} style={{ overflowY: 'auto', maxHeight: '400px' }}>
                                {messages.map((msg, index) => (
                                    <div
                                        key={index}
                                        className={`message ${msg.outgoing_msg_id === localStorage.getItem("UserId") ? "sender" : ""}`}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            margin: '5px 0'
                                        }}
                                    >
                                        {msg.file ? (
                                            <a 
                                                href={`http://localhost:8000/uploads/sendFile/${msg.file}`} 
                                                download 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                style={{ textDecoration: 'none', color: 'blue' }} // Ajout de styles pour le lien de téléchargement
                                            >
                                                Fichier: {msg.file}
                                            </a>
                                        ) : (
                                            <p style={{ maxWidth: '300px', margin: '0', padding: '5px', borderRadius: '5px' }}>
                                                {msg.message}
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Message input */}
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
                        <div className="no-user-selected">
                            <p>Sélectionnez un groupe pour démarrer une conversation de groupe.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
