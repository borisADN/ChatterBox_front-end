import React, { useEffect, useState } from "react";
import { UserStyle } from "./style";
import axios from "axios";
import { IoSearch } from "react-icons/io5";
import "./Users.css";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [userCount, setUserCount] = useState(0);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/all_users");
      const data = response.data;
      setUsers(data);
      setUserCount(data.length);
      console.log(data);
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs :", error);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={UserStyle.Container} className="Poppins">
      <div className="contacts">
        <h2>Contacts</h2>
        <div className="search-bar">
          <input 
            type="text" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)} 
            placeholder="Rechercher des utilisateurs..."
          />
          <IoSearch />
        </div>
        <div className="contact_container">
          {userCount === 1 ? (
            <p>Vous êtes le seul utilisateur connecté.</p>
          ) : (
            filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div className="contact" key={user.id}>
                  <div className="pic" style={{ backgroundImage: `url(${user.avatar})` }}></div>
                  <p style={{ fontWeight:"bold", color:"black"}}>{user.name}</p>
                </div>
              ))
            ) : (
              <p style={{ color: "red" , fontWeight:"bold" }}>Aucun utilisateur trouvé !</p> // Message si aucun utilisateur ne correspond à la recherche
            )
          )}
        </div>
      </div>
    </div>
  );
}
