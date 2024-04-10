import React, { createContext, useContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from "firebase/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true); // Added state to track authentication loading status

  useEffect(() => {
    const auth = getAuth();
    // Set up a subscription to onAuthStateChanged to listen for changes in authentication state
    const unsubscribe = onAuthStateChanged(auth, user => {
      setCurrentUser(user); // Update the currentUser state with the authenticated user
      setAuthLoading(false); // Set authLoading to false once the user's authentication state is confirmed
    });

    // Return the unsubscribe function to clean up the subscription
    return unsubscribe;
  }, []);

  // Provide an optional loading indicator or null while authentication status is being checked
  // This can be replaced with a more elaborate loading component if desired
  if (authLoading) {
    return <div>Loading...</div>;
  }

  // Once authentication status is confirmed (authLoading is false), render the children components
  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
