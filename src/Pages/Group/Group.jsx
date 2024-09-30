import React, { useState, useEffect, useRef } from "react"; 
import axios from "axios"; // Importer axios
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
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const chatRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const defaultAvatar = 'http://localhost:8000/uploads/default-avatar.png';
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return format(date, 'dd/MM/yyyy HH:mm'); // Format souhaité : jour/mois/année heures:minutes
    };

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
            // console.log(messages.sender_id);
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
    
    };

 

    const handleSendFile = async () => {
        if (!selectedFile) return; // Ensure a file is selected

    const formData = new FormData();
    formData.append("group_id", selectedGroup.id);
    formData.append("sender_id", localStorage.getItem("UserId"));
    formData.append("message", "Fichier partagé"); // Set default message
    formData.append("file", selectedFile); // Append the selected file

    try {
        const response = await axios.post('http://localhost:8000/api/SendMessageGroup', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Set content type for file upload
            },
        });

        // Update messages state with the new message and file data
        setMessages(prevMessages => [...prevMessages, response.data.data]); // Use the response data directly
        setSelectedFile(null); // Reset the selected file

        scrollToBottom(); // Scroll to the bottom after sending
    } catch (error) {
        console.log(error.message);
        
        console.error("Erreur lors de l'envoi du fichier:", error);
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
            className={`message ${msg.sender_id != localStorage.getItem("UserId") ? "" : "sender"}` } 
            style={{
                display: 'flex', flexDirection: 'column'
                // justifyContent: msg.sender_id === localStorage.getItem("UserId") ? 'flex-end' : 'flex-start'
            }}
            // style={{
            //     display: 'flex',
            //     alignItems: 'center',
            //     margin: '5px 0',
            //     justifyContent: msg.sender_id === localStorage.getItem("UserId") ? 'flex-end' : 'flex-start'
            // }}
        >


              {/* Affichage du nom de l'expéditeur */}
              <span style={{ fontWeight: 'bold' }}>Boris</span>
                {/* Affichage de la date d'envoi */}
            {/* Affichage des fichiers avec icônes et prévisualisation */}
                {/* <span style={{ fontSize: '0.8em', color: msg.sender_id === localStorage.getItem("UserId") ? '#555' : '' }}>{formatDate(msg.created_at)}</span> */}
            {msg.file ? (
                <div className="file-message" style={{ display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '10px'}}>
                    {/* Si le fichier est une image */}
                    {msg.file.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                        <div style={{ marginRight: '10px' }}>
                            <img 
                                src={`http://localhost:8000/uploads/sendGroupFile/${msg.file}`} target="_blank" 
                                alt="preview" 
                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }} 
                            />
                        </div>
                    ) : (
                        /* Si c'est un autre type de fichier (PDF, doc, etc.) */
                        <div style={{ marginRight: '10px' }}>
                            <FaPaperclip size={30} style={{ color: '#555' }} />
                        </div>
                    )}
                    {/* Lien de téléchargement */}
                    <div>
                        <a 
                            href={`http://localhost:8000/uploads/sendGroupFile/${msg.file}`} target="_blank" 
                            download={msg.file}
                            style={{ textDecoration: 'none', color: 'blue', fontWeight: 'bold' }}
                        >
                            {msg.file}
                        </a>
                    </div>
                </div>
            ) : (
                // Affichage des messages textuels
                <p style={{ background: msg.sender_id === localStorage.getItem("UserId") ? '#e1ffc' : '' , borderRadius: '10px' }}>
                    {msg.message}
                </p>
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
