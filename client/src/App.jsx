import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/home/Layout';
import CreateCar from './pages/CreateCar';
import ShowCar from './pages/ShowCar';
import EditCar from './pages/EditCar';
import DeleteCar from './pages/DeleteCar';
import Home from './pages/Home';
import { AuthProvider } from './contexts/AuthContext';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Landing from './pages/Landing';
import ProtectedRoutes from './components/ProtectedRoutes';

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path='/home' element={<Layout><ProtectedRoutes><Home /></ProtectedRoutes></Layout>} />
        <Route path="/cars/create" element={<Layout><ProtectedRoutes><CreateCar /></ProtectedRoutes></Layout>} />
        <Route path="/cars/details/:id" element={<Layout><ProtectedRoutes><ShowCar /></ProtectedRoutes></Layout>} />
        <Route path="/cars/edit/:id" element={<Layout><ProtectedRoutes><EditCar /></ProtectedRoutes></Layout>} />
        <Route path="/cars/delete/:id" element={<Layout><ProtectedRoutes><DeleteCar /></ProtectedRoutes></Layout>} />
       
      </Routes>
    </AuthProvider>
  );
};

export default App;

