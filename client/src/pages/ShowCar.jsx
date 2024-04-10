import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';

const ShowCar = () => {
  const [car, setCar] = useState({});
  const [loading, setLoading] = useState(true); // Set loading to true initially
  const { id } = useParams();

  useEffect(() => {
    axios
      .get(`http://localhost:3500/cars/${id}`)
      .then((response) => {
        setCar(response.data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setLoading(false)); // Ensure loading is set to false after the operation
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="container max-w-4xl p-4">
        <BackButton />
        <h1 className="text-3xl text-center my-4">Car Details</h1>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="border-2 border-sky-400 rounded-xl p-4 shadow-lg w-full">
            {/* Image should not exceed the max width and is responsive */}
            {car.imageUrl && (
              <img
                src={car.imageUrl}
                alt="Car"
                className="mb-4 max-w-full h-auto rounded-lg"
              />
            )}

            {/* Align content to the left */}
            <div className="text-left">
              <div className="text-lg my-4">
                <span className="font-bold mr-2">VIN#:</span>
                <span>{car._id}</span>
              </div>

              <div className="text-lg my-4">
                <span className="font-bold mr-2">MAKE:</span>
                <span>{car.make}</span>
              </div>

              <div className="text-lg my-4">
                <span className="font-bold mr-2">BRAND:</span>
                <span>{car.brand}</span>
              </div>

              <div className="text-lg my-4">
                <span className="font-bold mr-2">YEAR:</span>
                <span>{car.year}</span>
              </div>

              <div className="my-4">
                <p><b>Details</b></p>
                <p>
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor 
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud 
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                  dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. 
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
               </p>
              </div>

              <div className="text-lg my-4">
                <span className="font-bold mr-2">Arrival Date:</span>
                <span>{new Date(car.createdAt).toLocaleString()}</span>
              </div>

              <div className="text-lg my-4">
                <span className="font-bold mr-2">Last Updated Date:</span>
                <span>{new Date(car.updatedAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShowCar;

