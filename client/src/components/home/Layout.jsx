import React from 'react';
import Header from '../home/Header'; // Adjust the path as necessary
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
  const { currentUser } = useAuth();

  return (
    <>
      {currentUser && <Header />}
      <main>{children}</main>
    </>
  );
};

export default Layout;