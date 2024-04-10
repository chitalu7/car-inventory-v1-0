import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { getAuth, signOut } from 'firebase/auth';

const Header = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const handleLogout = async () => {
    const auth = getAuth();
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const navigateHome = () => {
    navigate('/home'); // Assuming '/home' is your home route
  };

  return (
    <div className="flex justify-between items-center py-4 px-8 bg-gray-200 flex-wrap">
      <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex-grow"><a onClick={navigateHome} >Dashboard</a></h1>
      {currentUser && (
        <div className="flex-grow text-center md:text-left text-sm md:text-lg text-gray-700 mb-2 md:mb-0">
          Welcome, {currentUser.email}
        </div>
      )}
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded self-center"
      >
        Logout
      </button>
    </div>
  );
};

export default Header;

