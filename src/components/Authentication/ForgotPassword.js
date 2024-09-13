import React, { useState } from 'react';
import supabase from '../../supabaseClient';
import { Link } from 'react-router-dom';

import backgrounImg from '../../assets/images/physiotherapy_clinic_background.png';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handlePasswordReset = async () => {
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://localhost:3000/reset-password', // Update with your redirect URL
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      setMessage(null);
    } else {
      setError(null);
      setMessage('Upute za resetiranje lozinke su poslane na vašu email adresu.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-cyan-500 to-blue-500 min-h-screen flex items-center justify-center bg-login-pattern bg-cover">
      <div className="flex items-center justify-center bg-gray-100 " style={{backgroundImage:{backgrounImg}}}>
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <h1 className="text-2xl font-bold mb-6" style={{color: '#002f46'}}>Resetiranje lozinke</h1>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {message && <p className="text-green-500 mb-4">{message}</p>}
          {/* Reset password form */}
          <input
            type="email"
            placeholder="Unesite email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-4 w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handlePasswordReset}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-2"
            style={{ backgroundColor: '#002f46' }}
            disabled={loading}
          >
            {loading ? 'Slanje...' : 'Pošalji upute'}
          </button>
          <p className="mt-4">
            Sjetili ste se lozinke?{' '}
            <Link to="/login" className="text-blue-500 hover:underline">
              Prijavite se
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
