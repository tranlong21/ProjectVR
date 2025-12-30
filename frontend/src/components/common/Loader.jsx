import React from 'react';

const Loader = ({ size = 'md', overlay = false, fullScreen = false }) => {
    // Size mapping
    const sizeClasses = {
        sm: 'w-6 h-6 border-2',
        md: 'w-10 h-10 border-4',
        lg: 'w-16 h-16 border-4',
    };

    const spinner = (
        <div
            className={`${sizeClasses[size] || sizeClasses.md} rounded-full animate-spin border-gray-300 border-t-[var(--primary)]`}
            role="status"
            aria-label="Loading"
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-gray-900 text-white">
                <div className="flex flex-col items-center gap-4">
                    {spinner}
                    <p className="text-lg font-medium animate-pulse">Loading VR Experience...</p>
                </div>
            </div>
        );
    }

    if (overlay) {
        return (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-inherit">
                {spinner}
            </div>
        );
    }

    return <div className="flex justify-center p-4">{spinner}</div>;
};

export default Loader;
