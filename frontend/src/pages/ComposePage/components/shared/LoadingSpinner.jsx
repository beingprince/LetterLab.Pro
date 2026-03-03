import React from 'react';

/**
 * LoadingSpinner - Simple loading indicator
 */
const LoadingSpinner = ({ size = 'md', className = '' }) => {
    const sizeClasses = {
        sm: 'w-4 h-4 border-2',
        md: 'w-6 h-6 border-2',
        lg: 'w-8 h-8 border-3'
    };

    return (
        <div
            className={`
        ${sizeClasses[size]} 
        border-blue-600 
        border-t-transparent 
        rounded-full 
        animate-spin
        ${className}
      `}
            role="status"
            aria-label="Loading"
        />
    );
};

export default LoadingSpinner;
