import React, { useState } from 'react'
import Button from '../../Components/Button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios';
import toast from 'react-hot-toast';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handle_login = async (e) => {
      e.preventDefault();
      try {
        const response = await axios.post('http://192.168.1.138:8000/api/login', {
          email,
          password,
      });
      console.log(response.data.message);
      if (response.data.message === 'Login successful') {
        toast.success('Bienvenue!');
        localStorage.setItem('UserId', response.data.user.id);
        navigate('/dashboard');
      } else if(response.data.message === 'Login failed') {
        toast.error('Invalid email or password');
        console.log(response.data.message);

        
      }
      
      
    } catch (error) {
        toast.error('Identifiants invalides!');
        console.log(error);
        
      }
      
      return;
      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });
        const data = await response.json();
        console.log(data);
        if (data.success) {
          navigate('/dashboard');
        } else {
          toast.error(data.message);
        }
        
      } catch (error) {
        console.log(error);
      }
      
    }
  return (
    <div className="register">
    <form class="form" method="post" onSubmit={handle_login}>
      <p class="title">Connexion</p>
      <p class="message">Connectez-vous pour continuer l'aventure.</p>
      <div className="form_control" >
        <input type="email" id="email" required onChange={(e) => setEmail(e.target.value)}  />
        <label htmlFor="email">
          <span style={{ transitionDelay: "0ms" }}>E</span>
          <span style={{ transitionDelay: "50ms" }}>m</span>
          <span style={{ transitionDelay: "100ms" }}>a</span>
          <span style={{ transitionDelay: "150ms" }}>i</span>
          <span style={{ transitionDelay: "200ms" }}>l</span>
        </label>
      </div>

      <div className="form_control">
        <input type="password" id="password" required onChange={(e) => setPassword(e.target.value)}/>
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

   
      <div className="center">
        <Button text={"Se connecter"} className="submit" />
        {/* <button type="submit" class="submit">
        Submit
      </button> */}
        <p class="signin">Pas encore de compte?<Link to="/register" href="#">S'inscrire</Link>
        </p>
        
      </div>
        <p><Link to="/forgottenPassword" >Mot de passe oublie?</Link></p>
    </form>
  </div>
  )
}
