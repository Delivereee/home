import React from 'react';

interface ErrorStateProps {
  message: string;
  className?: string;
  height?: string;
  onRetry?: () => void;
  subtitle?: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message, 
  className = '', 
  height = 'h-64',
  onRetry,
  subtitle
}) => {
  return (
    <div className={`flex flex-col justify-center items-center ${height} ${className} p-4`}>
      {/* Error illustration */}
      <div className="w-40 h-40 mb-4 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
          className="w-full h-full text-red-300">
          <circle cx="12" cy="12" r="10" strokeWidth="1" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 9l-6 6M9 9l6 6" />
        </svg>
      </div>
      
      {/* Main error message */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{message}</h3>
      
      {/* Optional subtitle */}
      {subtitle && (
        <p className="text-gray-500 mb-4 text-center max-w-sm">{subtitle}</p>
      )}
      
      {/* Retry button */}
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition mt-2"
          aria-label="Retry"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState; 