import React, { useEffect, useState } from 'react';
import supabase from './supabaseClient';

function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get the logged-in user details
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
    };

    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        {user ? (
          <div>
            <p className="mb-4">Welcome, {user.email}!</p>
            <button
              onClick={handleSignOut}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Sign Out
            </button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
