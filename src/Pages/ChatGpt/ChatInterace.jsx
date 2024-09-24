import React, { useState, useEffect, useRef } from "react";
import { FaPaperclip, FaPaperPlane, FaTrash } from "react-icons/fa";
import logo from "../../assets/40138-removebg-preview.png";
import "../ChatInterface/Chat.css"; // Importer un fichier CSS pour le style

export default function Chat() {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const chatRef = useRef(null);

    // Scrolling automatique au bas du chat lors de l'ajout de messages
    useEffect(() => {
        if (chatRef.current) {
            chatRef.current.scrollTop = chatRef.current.scrollHeight;
        }
    }, [messages]);

    const formatTime = (date) => {
        return `${date.getHours()}:${date.getMinutes() < 10 ? "0" : ""}${date.getMinutes()}`;
    };

    const handleSendMessage = () => {
        if (message.trim()) {
            const newMessage = {
                text: message,
                type: "text",
                sender: "You",
                time: new Date(),
            };
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            setMessage(""); // Réinitialiser le champ message
        }
    };

    const handleSendFile = () => {
        if (selectedFile) {
            const newFileMessage = {
                file: selectedFile,
                type: "file",
                sender: "You",
                time: new Date(),
            };
            setMessages((prevMessages) => [...prevMessages, newFileMessage]);
            setSelectedFile(null); // Réinitialiser la sélection de fichier
        }
    };

    const handleDeleteMessage = (index) => {
        setMessages((prevMessages) => prevMessages.filter((_, i) => i !== index));
    };

    const renderMessageContent = (msg) => {
        if (msg.type === "text") {
            return msg.text;
        } else if (msg.type === "file") {
            const fileUrl = URL.createObjectURL(msg.file);
            const fileName = msg.file.name;
            return <a href={fileUrl} download>{fileName}</a>;
        }
    };

    return (
        <div className="chat-container">
            {/* En-tête du chat */}
            <div className="chat-header">
                <div className="chat-logo">
                    <img src={logo} alt="Logo" />
                </div>
                <h2>Discussion en cours</h2>
            </div>

            {/* Section des messages */}
            <div className="chat-messages" ref={chatRef}>
                {messages.length === 0 ? (
                    <p className="no-messages">Aucun message pour le moment</p>
                ) : (
                    messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender === "You" ? "sender" : "receiver"}`}>
                            <div className="message-content">{renderMessageContent(msg)}</div>
                            <div className="message-time">{formatTime(msg.time)}</div>
                            <FaTrash 
                                className="delete-icon"
                                onClick={() => handleDeleteMessage(index)}
                                style={{ cursor: "pointer", color: "red", marginLeft: "10px" }}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Barre d'envoi des messages */}
            <div className="chat-input">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tapez un message..."
                />
                <div className="chat-actions">
                    {/* Envoi du message */}
                    <button onClick={handleSendMessage} className="send-button">
                        <FaPaperPlane />
                    </button>

                    {/* Jointure de fichier */}
                    <input
                        type="file"
                        onChange={(e) => setSelectedFile(e.target.files[0])}
                        style={{ display: "none" }}
                        id="file-input"
                    />
                    <label htmlFor="file-input" className="file-attach">
                        <FaPaperclip />
                    </label>

                    {/* Envoi du fichier joint */}
                    <button 
                        onClick={handleSendFile} 
                        className={`send-file ${selectedFile ? "active" : "inactive"}`}
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
}
