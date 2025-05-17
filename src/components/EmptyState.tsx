import React from 'react';

interface EmptyStateProps {
  message: string;
  className?: string;
  height?: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
  hideIcon?: boolean;
}

const EmptyState: React.FC<EmptyStateProps> = ({ 
  message, 
  className = '', 
  height = 'h-64',
  subtitle,
  actionText,
  onAction,
  hideIcon = false
}) => {
  return (
    <div className={`flex flex-col justify-center items-center ${height} ${className} p-4`}>
      {/* Empty state illustration - only show if hideIcon is false */}
      {!hideIcon && (
        <div className="w-40 h-40 mb-4 flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            className="w-full h-full text-gray-300"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1"
              d="M18 6L6 18M6 6l12 12"
            />
            <circle cx="12" cy="12" r="10" strokeWidth="1" />
          </svg>
        </div>
      )}
      
      {/* Main message */}
      <h3 className="text-xl font-semibold text-gray-800 mb-2 text-center">{message}</h3>
      
      {/* Optional subtitle */}
      {subtitle && (
        <p className="text-gray-500 mb-4 text-center max-w-sm">{subtitle}</p>
      )}
      
      {/* Optional action button */}
      {actionText && onAction && (
        <button 
          onClick={onAction}
          className="px-4 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition mt-2"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState; 