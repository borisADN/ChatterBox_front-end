import React from 'react'
import './Dashboard.css'
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const navigate = useNavigate();
  // Your code here to fetch user data and display it in the dashboard goes here.
  // Example:
  // const userData = await fetchUserData()
  // const user = userData.find(user => user.id === userId)
  // if (user) {
  //   return (
  //     <div>
  //       <h1>Welcome, {user.name}!</h1>
  //       <p>Your current status: {user.status}</p>
  //       {/* Add more dashboard features as needed */}
  //     </div>
  //   )
  // } else {
  //   return <p>User not found.</p>
  // }
  return (
    <div className='App' style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100vh",flexDirection:"column",backgroundColor:"#9787f5",color:"white"}}>
 <div className="welcome-container">
                    <h1>Bienvenue!</h1>
                    <p>Veuillez sélectionner un utilisateur pour commencer à discuter et continuer l'aventure!</p>
                   <Link to={"/chat"}> <button id="continueBtn">Continuer</button></Link>
                    {/* <button  > Continuer</button> */}
                </div>
    </div>
  )
}
