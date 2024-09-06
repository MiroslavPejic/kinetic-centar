import React, { useEffect, useState } from 'react';
import supabase from '../../supabaseClient';

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-custom-blue to-white">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <h1 className="text-2xl font-bold mb-6 text-center">Profil</h1>
        {user ? (
          <div>
            <p className="mb-4 text-center">Email:</p>
            <p className="mb-4 text-center">{user.email}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
