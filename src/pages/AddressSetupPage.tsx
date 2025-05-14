import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackHeader from '../components/BackHeader';

const AddressSetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [mainAddress, setMainAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');

  // Placeholder handlers (no actual functionality yet)
  const handleUseGPS = () => {
    console.log('Use GPS clicked');
  };

  const handleUploadBooking = () => {
    console.log('Upload booking screenshot clicked');
  };

  const handleSaveAddress = () => {
    console.log('Save address clicked');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with back button */}
      <BackHeader title="Address Setup" />
      
      <div className="flex-1 px-4 py-4 pb-20">
        {/* Main container */}
        <div className="rounded-lg border border-gray-200 p-5 mb-4 bg-white shadow-sm">
          {/* Main Address Section */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="mainAddress" className="text-base font-medium text-gray-700">
                Main Address
              </label>
              
              <button
                type="button"
                onClick={handleUseGPS}
                className="flex items-center justify-center gap-1 py-1.5 px-3 bg-gray-100 rounded-full hover:bg-gray-200 active:bg-gray-300 transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-700">Use GPS</span>
              </button>
            </div>
            
            <input
              type="text"
              id="mainAddress"
              value={mainAddress}
              onChange={(e) => setMainAddress(e.target.value)}
              placeholder="Hongdae, Mapo-gu, Seoul"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all duration-150 placeholder-gray-400"
            />
          </div>
          
          {/* Detail Address Section - Smaller font size and left aligned */}
          <div>
            <label htmlFor="detailAddress" className="block text-sm font-medium text-gray-600 mb-2 text-left">
              Detail Address
            </label>
            
            <textarea
              id="detailAddress"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              placeholder="e.g. Room 301, 123 Hongdae-ro"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all duration-150 resize-none h-28 placeholder-gray-400"
            />
          </div>
        </div>
        
        {/* Upload Booking Screenshot Section */}
        <div className="rounded-lg border border-gray-200 p-5 mb-6 bg-white shadow-sm">
          <button
            type="button"
            onClick={handleUploadBooking}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-all duration-150 mb-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="text-base font-medium text-gray-700">Upload Booking Screenshot (OCR)</span>
          </button>
          
          <p className="text-center text-gray-500 text-sm">
            Upload your hotel booking confirmation to extract address automatically
          </p>
        </div>
        
        {/* Save Address Button - Updated to Material Design style */}
        <button
          type="button"
          onClick={handleSaveAddress}
          className="w-full py-3.5 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 active:bg-red-700 transition-all duration-150 shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2"
        >
          Save Address
        </button>
      </div>
      
      {/* Navigation Bar */}
      <div className="border-t border-gray-200 bg-white py-2 grid grid-cols-4 fixed bottom-0 w-full shadow-lg">
        <button className="flex flex-col items-center justify-center py-1 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs text-gray-500 mt-1">Home</span>
        </button>
        
        <button className="flex flex-col items-center justify-center py-1 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="text-xs text-gray-500 mt-1">Browse</span>
        </button>
        
        <button className="flex flex-col items-center justify-center py-1 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs text-red-500 mt-1">Address</span>
        </button>
        
        <button className="flex flex-col items-center justify-center py-1 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <span className="text-xs text-gray-500 mt-1">Cart</span>
        </button>
      </div>
    </div>
  );
};

export default AddressSetupPage; 