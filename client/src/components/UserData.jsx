import React, { useEffect, useState } from 'react';
import { readUserData } from '../services/firebaseService';

const UserProfile = ({ userId }) => {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    readUserData(userId, setUserData);
  }, [userId]);

  return (
    <div>
      <h1>User Profile</h1>
      {/* Display user data */}
      <p>Name: {userData.name}</p>
      <p>Description: {userData.description}</p>
    </div>
  );
};

export default UserProfile;

