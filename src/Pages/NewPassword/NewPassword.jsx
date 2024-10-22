import React, { useState } from 'react'
import './NewPassword.css'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import axios from 'axios'

export default function NewPassword() {
    const [password, setPassword] = useState('')
    const [passwordConfirm, setPasswordConfirm] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const { email, code } = useParams()
    const navigate = useNavigate()


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password!== passwordConfirm) {
            toast.error('Les mots de passe ne sont pas identiques');
            return;
        }
        setIsLoading(true); // Indiquer que le chargement commence
        try {
            const response = await axios.post('http://localhost:8000/api/ResetPassword', {
                password,
                code: code,
                email: email
            });
            console.log(response.data);
            toast.success(response.data.message);
            navigate('/login');
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data.message || 'Une erreur est survenue');
        } finally {
            setIsLoading(false); // Indiquer que le chargement est terminé
        }
    }


  return (
    <div className='NewPassword'>
        <div className="d-flex flex-column justify-content-center min-vh-100 py-5 bg-light" style={{ maxWidth: "600px" }}>
    <div className="mx-auto w-100" >
        <h6 className="mt-6 text-center  font-weight-bold text-dark">
            Nouveau Mot De Passe
        </h6>
    </div>

    <div className="mt-4 mx-auto w-100" style={{ maxWidth: "600px" }}>
        <div className="p-4 bg-white shadow rounded">
            <form method="POST" action="" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="password" className="font-weight-bold">
                        Mot De Passe
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        autoFocus
                        placeholder="Saisir le mot de passe ici ..."
                        className="form-control"
                    />
                    <input type="hidden" name="email" id="email" value={email} />
                    <input type="hidden" name="code" id="code" value={code}/>
                </div>

                <div className="form-group mt-4">
                    <label htmlFor="passwordConfirm" className="font-weight-bold">
                        Confirmer Mot De Passe
                    </label>
                    <input
                        id="passwordConfirm"
                        type="password"
                        required
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                        name="passwordConfirm"
                        placeholder="Confirmer le nouveau mot de passe ici ..."
                        className="form-control"
                    />
                </div>

                <div className="mt-4">
                    <button type="submit"   className={`btn btn-primary btn-block ${isLoading ? "disabled" : ""}`}
                      disabled={isLoading} 
                    >
                   {isLoading ? "Chargement..." : "Soumettre"}
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>

    </div>
  )
}
