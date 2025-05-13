import React from 'react';

interface ErrorStateProps {
  message: string;
  className?: string;
  height?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message, 
  className = '', 
  height = 'h-64',
  onRetry 
}) => {
  return (
    <div className={`flex flex-col justify-center items-center ${height} ${className}`}>
      <p className="text-red-500 mb-4">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          aria-label="Retry"
        >
          Retry
        </button>
      )}
    </div>
  );
};

export default ErrorState; 