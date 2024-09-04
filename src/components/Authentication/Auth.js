import React, { useState } from 'react';
import supabase from '../../supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) setError(error.message);
    else navigate('/dashboard'); // Redirect to the dashboard on successful sign-in
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6" style={{color: '#002f46'}}>Prijava</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {/* Existing sign-in form fields */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="password"
          placeholder="Lozinka"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />
        <button
          onClick={handleSignIn}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-2"
          style={{ backgroundColor: '#002f46' }}
          disabled={loading}
        >
          {loading ? 'Prijava...' : 'Prijavi se'}
        </button>
        <p className="mt-4">
          Nemate račun?{' '}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Registrirajte se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Auth;
