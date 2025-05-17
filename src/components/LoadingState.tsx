import React, { useEffect, useId } from 'react';

interface LoadingStateProps {
  message?: string;
  className?: string;
  height?: string;
  id?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  className = '', 
  height = 'h-64',
  id
}) => {
  const uniqueId = useId();
  const loadingId = id || uniqueId;
  
  // 마운트 시 로깅
  useEffect(() => {
    console.log(`LoadingState mounted: ${loadingId}`);
    return () => {
      console.log(`LoadingState unmounted: ${loadingId}`);
    };
  }, [loadingId]);
  
  return (
    <div 
      id={`loading-${loadingId}`}
      className={`flex flex-col justify-center items-center ${height} ${className} p-4`}
      data-testid="loading-state"
    >
      {/* Loading spinner */}
      <div className="w-16 h-16 mb-6 relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0 2a10 10 0 110-20 10 10 0 010 20z" clipRule="evenodd" opacity="0.2" />
          </svg>
        </div>
      </div>
      
      {/* Loading message */}
      <p className="text-gray-600 text-lg">{message}</p>
      
      {/* Additional information */}
      <p className="text-gray-400 text-sm mt-2 max-w-xs text-center">
        This may take a moment as we find the best restaurants for you.
      </p>
    </div>
  );
};

export default LoadingState; 