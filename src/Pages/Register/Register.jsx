import React, { useState } from "react";
import "./Register.css";
import Button from "../../Components/Button";
import { Link, useNavigate } from "react-router-dom";
import { toast } from'react-hot-toast';
import axios from 'axios';


export default function Register() {
  const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [avatar, setAvatar] = useState(null);
  const navigate = useNavigate();

  const handle_register = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
  }

    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('password', password);
    formData.append('password_confirmation', confirmPassword);
    formData.append('avatar', avatar);

    try {
      const response = await axios.post('http://localhost:8000/api/register', formData, {
          headers: {
              'Content-Type': 'multipart/form-data',
          },
      });

      toast.success(response.data.message);
      navigate('/login');
  } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
        
          // La requête a été faite et le serveur a répondu avec un code d'état entre 400 et 500
        
          // La requête a été faite mais le serveur a répondu avec un code d'état non autorisé (non 4xx)

          // Le serveur a répondu avec un code d'état 422 (Unprocessable Entity)
          // console.log(error.response.data);  // Pour voir les détails de l'erreur
      } else if (error.request) {
        toast.error(error.request.data.message);
      } else {
        toast.error(error.message);
      }
  }
  
  }
  return (
    <div className="register">
      <form class="form" method="post" encType="multipart/form-data" onSubmit={handle_register}>
        <p class="title">Inscription</p>
        <p class="message">Inscrivez vous pour commencer l'aventure.</p>

        <div className="form_control">
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          <label htmlFor="name">
            <span style={{ transitionDelay: "0ms" }}>N</span>
            <span style={{ transitionDelay: "50ms" }}>o</span>
            <span style={{ transitionDelay: "100ms" }}>m</span>
          </label>
        </div>

        <div className="form_control">
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label htmlFor="email">
            <span style={{ transitionDelay: "0ms" }}>E</span>
            <span style={{ transitionDelay: "50ms" }}>m</span>
            <span style={{ transitionDelay: "100ms" }}>a</span>
            <span style={{ transitionDelay: "150ms" }}>i</span>
            <span style={{ transitionDelay: "200ms" }}>l</span>
          </label>
        </div>

        <div className="form_control">
          <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <label htmlFor="password">
            <span style={{ transitionDelay: "0ms" }}>M</span>
            <span style={{ transitionDelay: "50ms" }}>o</span>
            <span style={{ transitionDelay: "100ms" }}>t</span>
            <span style={{ transitionDelay: "150ms" }}> </span>
            <span style={{ transitionDelay: "200ms" }}>d</span>
            <span style={{ transitionDelay: "250ms" }}>e</span>
            <span style={{ transitionDelay: "300ms" }}> </span>
            <span style={{ transitionDelay: "350ms" }}>P</span>
            <span style={{ transitionDelay: "400ms" }}>a</span>
            <span style={{ transitionDelay: "450ms" }}>s</span>
            <span style={{ transitionDelay: "500ms" }}>s</span>
            <span style={{ transitionDelay: "550ms" }}>e</span>
          </label>
        </div>

        <div className="form_control">
          <input id="password-confirmation"  value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} type="password" required />
          <label htmlFor="password-confirmation">
            <span style={{ transitionDelay: "0ms" }}>C</span>
            <span style={{ transitionDelay: "50ms" }}>o</span>
            <span style={{ transitionDelay: "100ms" }}>n</span>
            <span style={{ transitionDelay: "150ms" }}>f</span>
            <span style={{ transitionDelay: "200ms" }}>i</span>
            <span style={{ transitionDelay: "250ms" }}>r</span>
            <span style={{ transitionDelay: "300ms" }}>m</span>
            <span style={{ transitionDelay: "350ms" }}>a</span>
            <span style={{ transitionDelay: "400ms" }}>t</span>
            <span style={{ transitionDelay: "450ms" }}>i</span>
            <span style={{ transitionDelay: "500ms" }}>o</span>
            <span style={{ transitionDelay: "550ms" }}>n</span>
            <span style={{ transitionDelay: "600ms" }}> </span>
            <span style={{ transitionDelay: "650ms" }}>d</span>
            <span style={{ transitionDelay: "700ms" }}>u</span>
            <span style={{ transitionDelay: "750ms" }}> </span>
            <span style={{ transitionDelay: "800ms" }}>m</span>
            <span style={{ transitionDelay: "850ms" }}>o</span>
            <span style={{ transitionDelay: "900ms" }}>t</span>
            <span style={{ transitionDelay: "950ms" }}> </span>
            <span style={{ transitionDelay: "1000ms" }}>d</span>
            <span style={{ transitionDelay: "1050ms" }}>e</span>
            <span style={{ transitionDelay: "1100ms" }}> </span>
            <span style={{ transitionDelay: "1150ms" }}>p</span>
            <span style={{ transitionDelay: "1200ms" }}>a</span>
            <span style={{ transitionDelay: "1250ms" }}>s</span>
            <span style={{ transitionDelay: "1300ms" }}>s</span>
            <span style={{ transitionDelay: "1350ms" }}>e</span>
          </label>
        </div>

        <small style={{ color: "#5a1111", fontSize: "15px" }}>
          Photo de Profil <span style={{ color: "red" }}>
            (Obligatoire)
          </span>{" "}
        </small>
        <label for="images" class="drop-container" id="dropcontainer">
          <input
            type="file"
            id="images"
            accept="image/*"
            required
            style={{ width: "100%" }}
            onChange={(e) => setAvatar(e.target.files[0])}
          />
        </label>

        <div className="center">
          <Button text={"S'inscrire"} className="submit" />
          <p class="signin">
            Deja Membre?<Link to="/login">Se Connecter</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
