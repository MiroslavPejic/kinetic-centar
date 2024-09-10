import React, { useState } from 'react';
import supabase from '../../supabaseClient';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async () => {
    setLoading(true);
    setError(null);

    // First, create the user in Supabase
    const { error: signUpError, data: signUpData } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    // Now, update the user's profile with the username
    const { error: updateError } = await supabase
      .from('profiles') // Assuming you have a `profiles` table
      .insert([{ id: signUpData.user.id, username, email }]);

    if (updateError) {
      setError(updateError.message);
    } else {
      alert('Račun je kreiran! Provjerite svoju e-poštu za potvrdu.');
      navigate('/');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-login-pattern bg-cover">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Registracija</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full p-2 border border-gray-300 rounded"
        />
        <input
          type="text"
          placeholder="Korisničko ime"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          onClick={handleSignUp}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
          disabled={loading}
        >
          {loading ? 'Registracija...' : 'Registriraj se'}
        </button>
      </div>
    </div>
  );
}

export default SignUp;
