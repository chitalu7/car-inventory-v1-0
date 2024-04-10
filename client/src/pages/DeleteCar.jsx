import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';

const DeleteCar = () => {

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Assuming '/cars/delete/:id' is the route
  const { enqueueSnackbar } = useSnackbar();
  const [car, setCar] = useState(location.state ? location.state.car : null);

  useEffect(() => {
    // Fetch the car details if not passed through state
    const fetchCar = async () => {
      if (!car) {
        try {
          const response = await axios.get(`http://localhost:3500/cars/${id}`);
          setCar(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching car details:", error);
          enqueueSnackbar('Error: Unable to fetch car details', { variant: 'error' });
          setLoading(false);
          navigate('/home'); // Redirect back if car details cannot be fetched
        }
      } else {
        setLoading(false); // If car is already set, no loading required
      }
    };

    fetchCar();
  }, [id, car, navigate, enqueueSnackbar]);

  const handleDeleteCar = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3500/cars/${car._id}`);
      setLoading(false);
      enqueueSnackbar('Car deleted successfully', { variant: 'success' });
      navigate('/home');
    } catch (err) {
      setLoading(false);
      enqueueSnackbar('Error: Unable to delete the car', { variant: 'error' });
      console.error(err);
    }
  };


  const handleCancel = () => {
    // Simply navigate back to the home page without deleting anything
    navigate('/home');
  };

  if (!car) return <LoadingSpinner />; // Or any other loading/fallback UI

  return (
    <div className='relative min-h-screen bg-gray-100'> {/* Ensure full viewport coverage and relative positioning for overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"> {/* Overlay covers entire viewport */}
          <LoadingSpinner />
        </div>
      )}
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <BackButton />
        </div>
        <h1 className='text-3xl font-semibold text-gray-800 mb-6 text-center'>Delete Car</h1>
        {!loading ? (
          <>
            <div className='flex flex-col items-center border-2 border-sky-400 rounded-lg w-full max-w-lg p-8 mx-auto'>
              <h3 className='text-2xl mb-4'>Are you sure you want to delete this car?</h3>
              {car.imageUrl && (
                <img src={car.imageUrl} alt={`${car.make} ${car.brand}`} className="mb-4 max-h-60 w-auto object-cover" />
              )}
              <p className="text-lg"> {car.brand} {car.make} - {car.year}</p>
              <p className="text-lg"> <b>Inventory count:</b> {car.inventoryCount}</p>
  
              <div className='flex flex-col sm:flex-row gap-4 w-full mt-8'>
                <button className='p-4 bg-red-700 text-white w-full px-4 rounded hover:bg-red-800 transition-colors duration-200 ease-in-out' onClick={handleDeleteCar}>
                  Delete Car
                </button>
                <button className='bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition-colors w-full' onClick={handleCancel}>
                  Cancel
                </button>
              </div>
            </div>
          </>
        ) : <LoadingSpinner />}
      </div>
    </div>
  );
  
}

export default DeleteCar

