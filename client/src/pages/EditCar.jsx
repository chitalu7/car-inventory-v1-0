// EditCar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { storage } from '../../firebaseConfig'; // Ensure correct path
import { ref, uploadBytesResumable, getDownloadURL, getMetadata } from 'firebase/storage';
import BackButton from '../components/BackButton';
import LoadingSpinner from '../components/LoadingSpinner';


const EditCar = () => {
  const [make, setMake] = useState('');
  const [brand, setBrand] = useState('');
  const [year, setYear] = useState('');
  const [inventoryCount, setInventoryCount] = useState(0);
  const [carImage, setCarImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const [previewImage, setPreviewImage] = useState(''); // New state for image preview

 
  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:3500/cars/${id}`)
      .then((response) => {
        const { make, brand, year, imageUrl, inventoryCount } = response.data;
        setMake(make);
        setBrand(brand);
        setYear(year);
        setInventoryCount(inventoryCount);
        setCurrentImageUrl(imageUrl);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error('Error fetching car details:', error);
        enqueueSnackbar('Error fetching car details.', { variant: 'error' });
      });
  }, [id, enqueueSnackbar]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCarImage(file);
      setPreviewImage(URL.createObjectURL(file)); // Update the preview image
    }
  };

  const uploadImage = async (imageFile) => {
    if (!imageFile) {
      return currentImageUrl; // If no new image is provided, use the current image URL
    }

    const imageName = `car_images/${imageFile.name}`;
    const storageRef = ref(storage, imageName);

    try {
      await getMetadata(storageRef); // Check if the file exists
      enqueueSnackbar('An image file with this name already exists. Please rename the file or select a different image.', { variant: 'error' });
      return Promise.reject(new Error('File already exists.'));
    } catch (error) {
      if (error.code === 'storage/object-not-found') {
        // File does not exist, proceed with upload
        const uploadTask = uploadBytesResumable(storageRef, imageFile);
        return new Promise((resolve, reject) => {
          uploadTask.on('state_changed',
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              console.error("Error uploading image:", error);
              enqueueSnackbar('Error uploading image.', { variant: 'error' });
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                resolve(downloadURL);
              });
            }
          );
        });
      } else {
        // Other errors
        console.error("Error uploading image:", error);
        enqueueSnackbar('Error uploading image.', { variant: 'error' });
        return Promise.reject(error);
      }
    }
  };

  const handleEditCar = async () => {
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

    if (parseInt(inventoryCount) < 0) {
      enqueueSnackbar('Inventory count cannot be negative.', { variant: 'error' });
      return;
    }

    
    setLoading(true);
    let imageUrl = currentImageUrl; // Use current image URL by default

    try {
      if (carImage) {
        imageUrl = await uploadImage(carImage); // Update if a new image is uploaded
      }

      const updateData = {
        make,
        brand,
        year,
        imageUrl,
        inventoryCount,
      };

      await axios.put(`http://localhost:3500/cars/${id}`, updateData);
      enqueueSnackbar('Car updated successfully', { variant: 'success' });
      navigate('/home');
    } catch (error) {
      console.error('Error updating car:', error);
      enqueueSnackbar('Error updating car.', { variant: 'error' });
    } finally {
      setLoading(false);
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
    <div className='relative min-h-screen bg-gray-100'>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <LoadingSpinner />
        </div>
      )}

      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-between items-center mb-8">
          <BackButton />          
        </div>

      <h1 className='text-3xl font-semibold text-gray-800 mb-6 text-center'>Edit Car Details</h1>

      
      <div className={`flex flex-col border-2 border-sky-400 rounded-xl md:w-[600px] w-full p-4 mx-auto ${loading ? 'opacity-50 pointer-events-none' : ''}`}> {/* Dim and disable interaction with the form when loading */}

        {/* Image preview or current image */}
        <div className='my-4'>
          {previewImage ? (
            <figure>
              <img src={previewImage} alt="Preview" className="w-full h-auto mb-4" />
              <figcaption><i>New image preview</i></figcaption>
            </figure>
          ) : currentImageUrl && (
            <figure>
              <img src={currentImageUrl} alt="Current Car" className="w-full h-auto mb-4" />
              <figcaption><i>Current image</i></figcaption>
            </figure>
          )}
        </div>
  
        {/* Image Upload Input */}
        <div className='my-4'>
        <label className='text-xl text-gray-500 block mb-2'>Upload Image (Format: .WEBP, .JPG, .PNG; Size: No more than 2MB; Recommended Dimensions: 1200 x 675 pixels)</label>
          <input
            type='file'
            onChange={handleImageChange}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            disabled={loading}
          />
        </div>
  
        {/* Make Input */}
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Make</label>
          <input
            type='text'
            value={make}
            onChange={(e) => setMake(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
  
        {/* Brand Input */}
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Brand</label>
          <input
            type='text'
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
  
        {/* Year Input */}
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Year</label>
          <input
            type='number'
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
  
        {/* Inventory Count Input */}
        <div className='my-4'>
          <label className='text-xl mr-4 text-gray-500'>Inventory Count</label>
          <input
            type='number'
            value={inventoryCount}
            onChange={(e) => setInventoryCount(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
  
        {/* Buttons */}
        <div className='flex flex-col sm:flex-row gap-4 mt-4'>
          <button
            className='bg-sky-300 text-white font-bold py-2 px-4 rounded hover:bg-sky-400 transition-colors w-full'
            onClick={handleEditCar}
            disabled={loading}
          >
            Save changes to inventory
          </button>
          
          <button
            className='bg-gray-500 text-white font-bold py-2 px-4 rounded hover:bg-gray-600 transition-colors w-full'
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
        
      </div>
      </div>
    </div>
  );
  
}

export default EditCar