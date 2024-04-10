import React from 'react';
import { Link } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = ({ destination = '/home' }) => {
  return (
    <Link to={destination} className="flex items-center bg-sky-800 text-white px-4 py-2 rounded-lg w-fit hover:bg-sky-700 transition-colors duration-150 ease-in-out">
      <BsArrowLeft className="text-xl md:text-2xl" />
      <span className="ml-2 text-sm md:text-base">Back To Inventory List</span>
    </Link>
  );
};

export default BackButton;
