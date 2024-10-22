import React, { useState } from 'react'
import './OtpCode.css'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';


export default function OtpCode() {
    const navigate = useNavigate();
    const { email } = useParams();
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // Indiquer que le chargement commence
        try {
            const response = await axios.post('http://localhost:8000/api/VerifyOTP', { code , email });
            console.log(response.data);
            navigate(`/NewPassword/${email}/${code}`);
        } catch (error) {
         toast.error(error.response?.data.message || 'Une erreur est survenue');
        }finally {
            setIsLoading(false); // Indiquer que le chargement est terminé
          }
     
    };
  return (
    <div className='OtpCode'>
<div className="d-flex flex-column justify-content-center min-vh-100 py-5">
<div className="mx-auto w-100" style={{ maxWidth: "400px" }}>
  <h2 className="mt-6 text-3xl font-weight-bold text-center text-dark">
    Code De Confirmation
  </h2>
  <p className="mt-2 text-sm text-center text-muted">
    <a href="/login" class="font-weight-bold text-primary">
      retour sur la page de connexion
    </a>
  </p>
</div>

<h6 className="mt-6 text-xl text-center text-dark">
  Un code de confirmation a été envoyé à votre adresse e-mail.
</h6>
<h6 className="mt-6 text-xl text-center text-dark">
  Saisissez-le dans le champ ci-dessous pour continuer...
</h6>

<div className="mx-auto w-100 mt-4" style={{ maxWidth: "400px" }}>
  <div class="p-4 bg-white shadow rounded">
    <form method="POST" action="" onSubmit={handleSubmit}>
      <div class="form-group">
        <input
          type="text"
          className="form-control"
          placeholder="Code de Confirmation"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      {/* <br /> */}

      <div className="form-group">
        <button
          type="submit"
          className={`btn btn-primary btn-block ${isLoading ? "disabled" : ""}`}
          disabled={isLoading}
        >
          {isLoading ? "Chargement..." : "Soumettre"}
        </button>
      </div>
    </form>
  </div>
</div>
</div>
{/* <div class="d-flex flex-column justify-content-center min-vh-100 py-5 bg-light">
    <div class="mx-auto w-100" style="max-width: 400px;">
        <h2 class="mt-6 text-3xl font-weight-bold text-center text-dark">
            Code De Confirmation
        </h2>
        <p class="mt-2 text-sm text-center text-muted">
            <a href="#" class="font-weight-bold text-primary">
                retour sur la page de connexion
            </a>
        </p>
    </div>

    <h6 class="mt-6 text-xl text-center text-dark">
        Un code de confirmation a été envoyé à votre adresse e-mail.
    </h6>
    <h6 class="mt-6 text-xl text-center text-dark">
        Saisissez-le dans le champ ci-dessous pour continuer...
    </h6>

    <div class="mx-auto w-100 mt-4" style="max-width: 400px;">
        <div class="p-4 bg-white shadow rounded">
            <form method="POST" action="">
                <div class="form-group">
                    <label for="code" class="font-weight-bold">
                        Code de Confirmation
                    </label>
                    <input type="hidden" name="email" id="email" value="{{ session()->get('email') }}">
                    <input 
                        id="code" 
                        name="code" 
                        type="text" 
                        required 
                        autofocus 
                        autocomplete="off" 
                        placeholder="Saisir le code ici..." 
                        class="form-control" 
                    />
                </div>

                <div class="mt-4">
                    <button type="submit" class="btn btn-primary btn-block">
                        Soumettre
                    </button>
                </div>
            </form>
        </div>
    </div>
</div> */}

    </div>
  )
}
