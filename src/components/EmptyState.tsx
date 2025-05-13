import React from 'react';

interface EmptyStateProps {
  message: string;
  className?: string;
  height?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  className = '', 
  height = 'h-64' 
}) => {
  return (
    <div className={`flex justify-center items-center ${height} ${className}`}>
      <p className="text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState; 