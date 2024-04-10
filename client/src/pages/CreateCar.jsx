import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { storage } from '../../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, getMetadata } from 'firebase/storage';

const CreateCar = () => {
  const [make, setMake] = useState('');
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const [inventoryCount, setInventoryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [carImage, setCarImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(''); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCarImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Updated to use setPreviewImage
      };
      reader.readAsDataURL(file);
    }
  };


  const handleSaveCar = async () => {
    // Check if all required fields are provided and valid
    if (!carImage) {
      enqueueSnackbar('Please select an image for the car.', { variant: 'error' });
      return;
    }
    if (!make.trim()) {
      enqueueSnackbar('Please enter a make for the car.', { variant: 'error' });
      return;
    }
    if (!brand.trim()) {
      enqueueSnackbar('Please enter a brand for the car.', { variant: 'error' });
      return;
    }
    if (!year || year < 2000) {
      enqueueSnackbar('Please enter a valid year (2000 or later).', { variant: 'error' });
      return;
    }
    if (inventoryCount < 0) {
      enqueueSnackbar('Inventory count cannot be negative.', { variant: 'error' });
      return;
    }
  
    setLoading(true);
  
    try {
      const imageUrl = await uploadImage(carImage); // Assume uploadImage correctly defines imageUrl
  
      const data = {
        make,
        brand,
        year,
        imageUrl,
        inventoryCount,
      };
  
      await axios.post('http://localhost:3500/cars', data);
      setLoading(false);
      enqueueSnackbar('Car Created Successfully', { variant: 'success' });
      navigate('/home');
    } catch (error) {
      setLoading(false);
      enqueueSnackbar('Error creating car', { variant: 'error' });
      console.error('Error uploading car data: ', error);
    } finally {
      setLoading(false); // Unlock the UI by setting loading to false
    }
  };
  
  const uploadImage = async (imageFile) => {
    const imageName = `car_images/${imageFile.name}`;
    const storageRef = ref(storage, imageName);
  
    try {
      // Attempt to get the file's metadata to check if it exists
      await getMetadata(storageRef);
      // If getMetadata does not throw, the file exists - reject the promise
      console.error("Error uploading image: File already exists.");
      enqueueSnackbar('An image file with this name already exists. Please rename the file or select a different image.', { variant: 'error' });
      return Promise.reject(new Error('File already exists.'));
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        // File does not exist, proceed with upload
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
  
        return new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {
              // Optional: handle progress
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log('Upload is ' + progress + '% done');
            },
            (error) => {
              console.error("Error uploading image:", error);
              enqueueSnackbar('Error uploading image', { variant: 'error' });
              reject(error);
            },
            () => {
              // Handle successful uploads on complete
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      } else {
        // Some other error occurred
        console.error("Error uploading image:", error);
        enqueueSnackbar('Error uploading image', { variant: 'error' });
        return Promise.reject(error);
      }
    }
  };

  const handleReset = () => {
    setMake('');
    setBrand('');
    setYear('');
    setInventoryCount(0);
    setCarImage(null);
    setPreviewImage('');
    // Optionally clear the file input
    document.getElementById('imageInput').value = '';
  };
  

const handleCancel = () => {
  // Simply navigate back to the home page without deleting anything
  navigate('/home');
};


return (
  <div className={`relative ${loading ? 'opacity-50' : ''}`}>
  {loading && (
    <div className="absolute inset-0 z-50 flex justify-center items-center bg-black bg-opacity-50">
      <LoadingSpinner />
    </div>
  )}
    <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <BackButton />          
        </div>

      </div>
  <h1 className='text-3xl font-semibold text-gray-800 mb-6 text-center'>Add A New Car</h1>
      
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-full max-w-md mx-auto p-4'>
        <div className='my-4'>
          <label className='text-xl text-gray-500 block mb-2'>Upload Image (Format: .WEBP, .JPG, .PNG; Size: No more than 2MB; Recommended Dimensions: 1200 x 675 pixels)</label>
          <input
            id="imageInput"
            type='file'
            onChange={handleImageChange}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
          {previewImage && (
            <div className="mt-4">
              <img src={previewImage} alt="Preview" style={{ width: '100%', height: 'auto' }} />
            </div>
          )}
        </div>

        <div className='my-4'>
          <label className='text-xl text-gray-500 block mb-2'>Make</label>
          <input
            type='text'
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>

        <div className='my-4'>
          <label className='text-xl text-gray-500 block mb-2'>Brand</label>
          <input
            type='text'
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>

        <div className='my-4'>
          <label className='text-xl text-gray-500 block mb-2'>Year</label>
          <input
            type='number'
            value={year}
            min="2000" 
            onChange={(e) => setYear(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>

        <div className='my-4'>
          <label className='text-xl text-gray-500 block mb-2'>Inventory Count</label>
          <input
            type='number'
            value={inventoryCount}
            min="0" 
            onChange={(e) => setInventoryCount(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>

        <div className='flex flex-col sm:flex-row gap-4 mt-4'>
        <button 
          className='bg-sky-300 text-white font-bold py-2 px-4 rounded hover:bg-sky-400 transition-colors w-full' 
          onClick={handleSaveCar}
          disabled={loading}>
          Add to Inventory
        </button>
        <button
          className='bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700 transition-colors w-full'
          onClick={handleReset}
          disabled={loading}>
          Reset
        </button>
        <button 
          className='bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition-colors w-full' 
          onClick={handleCancel}>
          Cancel
        </button>
      </div>
      </div>
    </div>
);
  
}

export default CreateCar




