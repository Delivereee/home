import React from 'react';

interface LoadingStateProps {
  message?: string;
  className?: string;
  height?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({ 
  message = 'Loading...', 
  className = '', 
  height = 'h-64' 
}) => {
  return (
    <div className={`flex justify-center items-center ${height} ${className}`}>
      <p>{message}</p>
    </div>
  );
};

export default LoadingState; 