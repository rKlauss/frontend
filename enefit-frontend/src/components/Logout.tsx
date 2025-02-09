import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem('isLoggedIn'); 
    sessionStorage.removeItem('username');
    navigate('/');
  };

  return (
    <div className="flex justify-end">
      <button onClick={handleLogout} className="bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition duration-300">
        Logout
      </button>
    </div>
  );
};

export default Logout;