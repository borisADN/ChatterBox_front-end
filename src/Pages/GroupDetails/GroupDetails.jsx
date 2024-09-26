import React from "react";
import { useParams } from "react-router-dom";
import "./Style.css";

export default function GroupDetails() {
  const { groupId } = useParams();
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        height: "100vh",
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
      {/* Merci pour votre participation */}
    </div>
  );
}
