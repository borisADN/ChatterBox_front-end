import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "./Style.css";
import axios from "axios";

export default function GroupDetails() {
  const { groupId } = useParams();
  const [email, setEmail] = useState('');
  const AdderId = localStorage.getItem('UserId');
  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/InviteMember', {
        group_id: groupId,
        email: email,
        id: AdderId,
      });

      // if(response.data.)
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }

    
  }
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "100%",
        flexDirection: "column",
        backgroundColor: "#0d3b66"
      }}
    >
      <p>
        {groupId}
      </p>
      {/* Display group details here */}
      {/* Add any necessary components or styling */}
      {/* Example: <h1>Group Details</h1> */}
      <div>
        <img
          style={{ width: "200px", height: "200px", borderRadius: "50%" }}
          src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
          alt=""
        />
      </div>
      <h1>Nom Du Groupe</h1>
      <h3>Cree par Boris le 10/05/2023</h3>
      <h3>Membres : 2</h3>
      <div className="table">
        <table>
          <thead>
            <tr>
              <th>image</th>
              <th>Nom</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <img
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                  alt=""
                />
              </td>
              <td>Boris</td>
              <td>boris@example.com</td>
              <td><a href="">supprimer</a></td>
            </tr>
            <tr>
              <td>
                <img
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp"
                  alt=""
                />
              </td>
              <td>Marie</td>
              <td>marie@example.com</td>
              <td><a href="">supprimer</a></td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="invitation">
        <div>
      <h3>inviter un membre non inscrit au groupe</h3>

        </div>
<div className="invit-form">
<p>Invitez un membre non inscrit au groupe</p>
<p>il sera auтомatiquement ajouté au groupe lors de sa connexion sur chatterBox</p>

<input type="email" placeholder="Email du nouveau membre" style={{width:"300px", height:"30px"}} value={email} onChange={(e) => setEmail(e.target.value)} />
<button onClick={handleSubmit}  >Inviter</button>
</div>
      </div>
<div style={{marginTop:"40px"}}>

</div>
      {/* Merci pour votre participation */}
    </div>
  );
}
