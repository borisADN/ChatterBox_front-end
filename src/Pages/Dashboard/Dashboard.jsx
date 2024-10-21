import React from 'react'
import './Dashboard.css'
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  return (
    <div className='App' style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",flexDirection:"column",backgroundColor:"#9787f5",color:"white"}}>
 <div className="welcome-container">
                    <h1>Bienvenue!</h1>
                    <p>Veuillez sélectionner un utilisateur pour commencer à discuter et continuer l'aventure!</p>
                   <Link to={"/chat"}> <button id="continueBtn">Continuer</button></Link>
                </div>
    </div>
  )
}
