import React, { useEffect, useState } from 'react'
import './EditProfile.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function EditProfile() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState(null);
    const { UserId } = useParams();
    const navigate = useNavigate();

    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]); // Récupérer le fichier sélectionné
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
    
        // Créer un formData pour envoyer les données de manière multipart
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        if (avatar) {
          formData.append("avatar", avatar); // Ajouter le fichier avatar si sélectionné
        }
    
        try {
          const response = await axios.post(
            `http://localhost:8000/api/updateUser/${UserId}`, 
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", // Pour envoyer des fichiers
              },
            }
          );
          // Gérer la réponse en cas de succès
            toast.success(response.data.message);
            navigate("/chat");
        } catch (error) {
          // Gérer les erreurs
          if (error.response) {
            toast.error(error.response.data.message);
            
          } else {
            toast.error("Une erreur s'est produite.");

          }
        }
      };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/getCurrent/${UserId}`);
                // console.log(response.data);
                const data = response.data;
              
                setName(data.name || ""); // Si la valeur est indéfinie, on attribue une chaîne vide
        setEmail(data.email || ""); // Idem pour l'email
                
       
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };
        fetchUserData();
    }, [UserId]);
  return (
    <div className='EditProfile'>
<form action="" onSubmit={handleSubmit}>
<h1>Modifier votre profil</h1>
<div className="mb-3">
  <label htmlFor="exampleFormControlInput1" className="form-label">Nom</label>
  <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Nom"  value={name} onChange={(e) => setName(e.target.value)}/>
</div>

<div className="mb-3">
  <label htmlFor="exampleFormControlInput1" className="form-label">Adresse Email</label>
  <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
</div>

<div className="mb-3">
  <label htmlFor="formFile" className="form-label">
    Modifier votre avatar
  </label>
  <input
    className="form-control"
    type="file"
    id="formFile"
    onChange={handleFileChange}
  />
</div>


<button type="submit" className="btn btn-primary">Modifier</button>
</form>
    </div>
  )
}
