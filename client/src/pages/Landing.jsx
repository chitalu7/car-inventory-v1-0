import React from 'react';
import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    // Using Tailwind CSS for responsive full-screen background image
    <div className="min-h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat" 
         style={{
           backgroundImage: `url('/images/landing_page_background.webp')`,
           /* Overlay with opacity */
           backgroundColor: 'rgba(0, 0, 0, 0.75)', /* This creates a dark overlay */
           backgroundBlendMode: 'darken',
         }}>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-center">Welcome To Your Portal</h1>
      <p className="text-lg md:text-xl text-white mb-8 text-center">Track Your Inventory</p>
      
      <div className="space-x-4">
        <Link to='/login' className="px-6 py-3 bg-blue-500 text-white text-lg rounded-md shadow-md hover:bg-blue-700 transition-colors duration-200">Login</Link>
        
        <Link to='/signup' className="px-6 py-3 bg-green-500 text-white text-lg rounded-md shadow-md hover:bg-green-700 transition-colors duration-200">Signup</Link>
      </div>
    </div>
  )
}

export default Landing;
