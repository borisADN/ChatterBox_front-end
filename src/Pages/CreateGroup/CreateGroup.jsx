import React, { useState } from "react";
import "./CreateGroup.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function CreateGroup() {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [groupAvatar, setGroupAvatar] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();

    if (groupName === "") {
      toast.error("Veuillez renseigner le nom du groupe");
      return;
    }
    if (groupName.length < 5) {
      toast.error("Le nom du groupe doit contenir au moins 5 caractères");
      return;
    }
    const admin_id = localStorage.getItem("UserId");

    const formData = new FormData();
    formData.append("name", groupName);
    formData.append("description", description);
    formData.append("avatar", groupAvatar);
    formData.append("admin_id", admin_id);

    const response = await axios.post(
      "http://localhost:8000/api/CreateGroup",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );
    // console.log(response.data); // Pour vérifier le résultat de la requête

    if (response.status === 201) {
      navigate("/group");
    } else {
      toast.error(response.data.message);
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#9787f5",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <form
        className="form_container"
        onSubmit={handleSubmit}
        encType="multipart/form-data"
      >
        <h2>Créez un groupe</h2>
        <p>Créez un groupe de discussion pour discuter avec vos amis</p>

        <input
          type="text"
          placeholder="Donnez un nom au groupe"
          onChange={e => setGroupName(e.target.value)}
          required
        />

        <textarea
          placeholder="Description (optionnel)"
          onChange={e => setDescription(e.target.value)}
        />

        <label htmlFor="groupAvatar">Photo de profil</label>
        <input
          type="file"
          id="groupAvatar"
          onChange={e => setGroupAvatar(e.target.files[0])}
        />
        <button type="submit">Créer</button>
      </form>
    </div>
  );
}
