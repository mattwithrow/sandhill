import React from 'react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-16 w-16'
  };

  const textSizes = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  };

  return (
    <div className={`loading-container ${className}`}>
      <div className={`loading-spinner ${sizeClasses[size]} border-b-2 border-orange-500`}></div>
      {text && (
        <p className={`loading-text ${textSizes[size]} text-gray-600 mt-4`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
