import React from 'react';
import { FaHome, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import supabase from '../../supabaseClient';

import logo from '../../assets/images/kinetic-centar-znak-logo-final.png';

function TopNavBar() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-custom-teal text-custom-text shadow-md z-50 rounded-b-lg">
      {/* Apply rounded-b-lg to round bottom corners */}
      <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
        <div className="flex items-center">
          <img
            src={logo}  // Use the imported logo
            alt="Logo"
            className="h-8 w-auto mr-2"  // Adjust size and margin as needed
          />
          <h2 className="text-xl font-bold">Dashboard</h2>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li
              className="cursor-pointer hover:text-custom-teal-dark"
              onClick={() => navigate('/dashboard')}
            >
              <FaHome className="inline mr-1" />
              Home
            </li>
            <li
              className="cursor-pointer hover:text-custom-teal-dark"
              onClick={() => navigate('/profile')}
            >
              <FaUser className="inline mr-1" />
              Profile
            </li>
            <li
              className="cursor-pointer hover:text-custom-teal-dark"
              onClick={() => navigate('/customers')}
            >
              <FaUser className="inline mr-1" />
              Customers
            </li>
            <li
              className="cursor-pointer hover:text-custom-teal-dark"
              onClick={handleSignOut}
            >
              <FaSignOutAlt className="inline mr-1" />
              Sign Out
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}

export default TopNavBar;
