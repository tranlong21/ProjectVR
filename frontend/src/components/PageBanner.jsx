import React from 'react';
import PropTypes from 'prop-types';

const PageBanner = ({ title, subtitle, backgroundImage }) => {
    return (
        <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
            {/* Background Image */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${backgroundImage})` }}
                />
            )}

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent"></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-4">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 drop-shadow-2xl animate-fade-in-up">
                    {title}
                </h1>
                {subtitle && (
                    <p className="text-lg md:text-xl text-gray-200 max-w-3xl mx-auto drop-shadow-lg animate-fade-in-up delay-100">
                        {subtitle}
                    </p>
                )}
            </div>

            {/* Decorative Glow */}
            <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-[var(--accent-purple)] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        </div>
    );
};

PageBanner.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string,
    backgroundImage: PropTypes.string,
};

PageBanner.defaultProps = {
    subtitle: '',
    backgroundImage: '/assets/video/Untitled.mp4', // fallback to a generic image
};

export default PageBanner;
