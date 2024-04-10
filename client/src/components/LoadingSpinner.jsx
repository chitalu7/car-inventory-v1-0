import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      {/* Overlay Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center">
        {/* Spinner */}
        <div className="animate-spin rounded-full border-t-4 border-b-4 border-blue-400 w-24 h-24 mb-4"></div>
        {/* Loading text positioned inside the overlay, centered with the spinner */}
        <h5 className="text-white text-xl mt-4">Loading...</h5>
      </div>
    </div>
  );
};

export default LoadingSpinner;
