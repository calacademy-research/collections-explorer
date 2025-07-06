import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  text = 'Loading...',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin rounded-full border-4 border-gray-200 border-t-green-600`}></div>
      {text && (
        <p className="text-gray-600 text-sm font-medium">{text}</p>
      )}
    </div>
  );
};

export const LoadingOverlay: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-xl">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
};

export const LoadingCard: React.FC<{ text?: string }> = ({ text = 'Loading...' }) => {
  return (
    <div className="bg-white rounded-lg p-8 shadow-md border border-gray-200">
      <LoadingSpinner size="md" text={text} />
    </div>
  );
}; 