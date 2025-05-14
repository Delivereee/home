import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        {/* Error Icon */}
        <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-red-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
        
        {/* Error Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
        
        {/* Error Message */}
        <p className="text-gray-600 mb-10 text-center">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        {/* Order Status Info */}
        <div className="w-full bg-gray-100 rounded-lg p-6 mb-10">
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700">
                You might have mistyped the address or the page may have been moved.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="w-full max-w-md mx-auto mb-10">
        <button 
          onClick={() => navigate('/')}
          className="w-full py-4 bg-red-500 text-white rounded-lg font-medium mb-4 hover:bg-red-600 transition-colors"
        >
          Go to Home
        </button>
        
        <button 
          onClick={() => navigate(-1)}
          className="w-full py-4 border border-gray-300 text-gray-800 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage; 