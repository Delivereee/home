import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { orderId, paymentId } = location.state || {};

  // 직접 접근 방지: location.state가 없으면 홈으로 리다이렉션
  useEffect(() => {
    if (!location.state) {
      navigate('/', { replace: true });
    }
  }, [location.state, navigate]);

  // location.state가 없으면 렌더링하지 않음
  if (!location.state) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-4">
      <div className="flex-1 flex flex-col items-center justify-center w-full max-w-md mx-auto">
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
          <div className="w-20 h-20 rounded-full border-4 border-green-400 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        {/* Success Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-10">Payment Complete!</h1>
        
        {/* Order Status Info */}
        <div className="w-full bg-gray-100 rounded-lg p-6 mb-10">
          <div className="flex items-start mb-4">
            <div className="flex-shrink-0 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700 font-medium">
                We are <span className="text-gray-800">confirming your order</span>.
              </p>
              <p className="text-gray-700">
                This may take up to <span className="text-gray-800">5 minutes</span>.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="flex-shrink-0 mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-gray-700">
                Order details will be shared via <span className="text-gray-800 underline">email</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Buttons */}
      <div className="w-full max-w-md mx-auto mb-10">
        <button 
          onClick={() => navigate('/')}
          className="w-full py-4 bg-red-500 text-white rounded-lg font-medium mb-4"
        >
          Return to Home
        </button>
        
        <button 
          onClick={() => navigate('/browse')}
          className="w-full py-4 border border-gray-300 text-gray-800 rounded-lg font-medium"
        >
          Explore More Restaurants
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage; 