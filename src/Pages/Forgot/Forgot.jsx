import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import "./Forgot.css";

export default function Forgot() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Indiquer que le chargement commence
    try {
      const { data } = await axios.post("http://localhost:8000/api/ForgotPassword", {
        email,
      });
      toast.success(data.message);
      navigate(`/VerifyOtp/${email}`);
      // navigate('/login');
    } catch (error) {
      // console.log(error.response);
      toast.error(error.response?.data.message || "Une erreur est survenue.");
    } finally {
      setIsLoading(false); // Indiquer que le chargement est terminé
    }
  };

  return (
    <div className="Forgot">
      <div className="d-flex flex-column justify-content-center min-vh-100 py-5 bg-light">
        <div className="mx-auto w-100" style={{ maxWidth: "400px" }}>
          <h2 className="mt-3 text-center font-weight-bold text-dark">
            Mot De Passe Oublié
          </h2>
          <p className="mt-2 text-center text-muted">
            <a href="/login" className="font-weight-bold text-primary">
              retour sur la page de connexion
            </a>
          </p>
        </div>
        <div className="mx-auto w-100 mt-4" style={{ maxWidth: "600px" }}>
          <div className="p-4 bg-white shadow rounded">
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Renseignez votre Adresse Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className="mt-4">
                <button 
                  type="submit" 
                  className={`btn btn-primary btn-block ${isLoading ? "disabled" : ""}`}
                  disabled={isLoading} // Désactiver le bouton pendant le chargement
                >
                  {isLoading ? "Chargement..." : "Soumettre"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
