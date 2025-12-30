import React from 'react';

const Skeleton = ({ className = '', variant = 'text' }) => {
    // Base classes for animation and background
    const baseClasses = 'animate-pulse bg-gray-700/50 rounded';

    // Variant specific classes
    const variantClasses = {
        text: 'h-4 w-full',
        rectangular: 'h-full w-full',
        circular: 'rounded-full',
    };

    return (
        <div
            className={`${baseClasses} ${variantClasses[variant] || ''} ${className}`}
        />
    );
};

export default Skeleton;
