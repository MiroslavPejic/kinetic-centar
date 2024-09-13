import React, { useState } from 'react';
import supabase from '../../supabaseClient';
import { useNavigate, useSearchParams } from 'react-router-dom';
import backgrounImg from '../../assets/images/physiotherapy_clinic_background.png';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get('access_token');

  const handlePasswordReset = async () => {
    if (password !== confirmPassword) {
      setError('Lozinke se ne podudaraju.');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      setSuccess(null);
    } else {
      setError(null);
      setSuccess('Vaša lozinka je uspješno promijenjena. Preusmjeravamo vas na prijavu...');
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect after 3 seconds
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen flex items-center justify-center bg-login-pattern bg-cover">
      <div className="flex items-center justify-center bg-gray-100 " style={{backgroundImage:{backgrounImg}}}>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6" style={{color: '#002f46'}}>Promijenite lozinku</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          
          <input
            type="password"
            placeholder="Nova lozinka"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Potvrdite novu lozinku"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handlePasswordReset}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-2"
            style={{ backgroundColor: '#002f46' }}
            disabled={loading}
          >
            {loading ? 'Postavljanje lozinke...' : 'Postavi lozinku'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
