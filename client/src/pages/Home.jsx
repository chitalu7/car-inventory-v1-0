import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { MdOutlineAddBox } from 'react-icons/md';
import { getAuth, signOut } from "firebase/auth";
import LoadingSpinner from '../components/LoadingSpinner';
import CarsCards from '../components/home/CarsCards';


const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showType, setShowType] = useState('table');
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    axios.get('http://localhost:3500/cars')
      .then((response) => {
        setCars(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
     
      <div className="max-w-6xl mx-auto px-4 py-8">
  
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-semibold text-gray-800">Inventory List</h1>
          <Link to="/cars/create" className="flex items-center text-sky-800 hover:text-sky-600">
            <span className="text-xl mr-2">Add A New Car</span>
            <MdOutlineAddBox className="text-4xl" />
          </Link>
        </div>
  
        {loading ? (
          <LoadingSpinner />
        ) : cars.length > 0 ? (
          <CarsCards cars={cars} />
        ) : (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">There are currently no cars in the inventory.</p>
          </div>
        )}
  
      </div>
    </div>
  );
  
};

export default Home;

