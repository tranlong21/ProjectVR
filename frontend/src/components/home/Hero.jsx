import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <div
            className="
                relative w-full 
                aspect-video        /* MOBILE + TABLET = 16:9 like YouTube */
                lg:h-screen         /* DESKTOP = cinematic full height */
                overflow-hidden bg-black
            "
        >

            {/* Background Video */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="
                    absolute inset-0 w-full h-full 
                    object-cover object-center
                "
            >
                <source src="/assets/video/Untitled.mp4" type="video/mp4" />
            </video>

            {/* Gradient Overlay – makes text readable */}
            <div
                className="
                    absolute inset-0 z-10
                    bg-gradient-to-b 
                    from-black/75 via-black/45 to-black/80
                    lg:from-black/50 lg:via-black/25 lg:to-black/40
                "
            ></div>

            {/* CONTENT */}
            <div
                className="
                    absolute inset-0 z-20 
                    flex flex-col justify-end
                    px-4 sm:px-8 lg:px-24 
                    pb-5 sm:pb-10 lg:pb-24
                    max-w-sm sm:max-w-xl lg:max-w-3xl
                "
            >

                {/* Badge */}
                <span
                    className="
                        inline-block w-fit mb-2 px-2 py-[2px]
                        rounded border border-[var(--accent-purple)]
                        text-[9px] sm:text-xs tracking-wider text-gray-200
                    "
                >
                    IMMERSIVE REALITY
                </span>

                {/* Title */}
                <h1
                    className="
                        text-white font-bold leading-tight
                        text-lg sm:text-3xl md:text-4xl lg:text-6xl
                        drop-shadow-lg
                    "
                >
                    Trải Nghiệm Tương Lai <br />
                    <span className="text-[var(--accent-purple)]">
                        Của Thực Tế Số
                    </span>
                </h1>

                {/* Subtitle */}
                <p
                    className="
                        text-gray-300 
                        text-xs sm:text-sm md:text-base 
                        mt-2 mb-4 
                        leading-relaxed max-w-[85%] sm:max-w-md
                    "
                >
                    Giải Pháp VR/AR Đắm Chìm Cho Doanh Nghiệp Và Giải Trí.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap gap-2 sm:gap-4">
                    
                    {/* Primary CTA */}
                    <Link
                        to="/projects"
                        className="
                            inline-flex items-center 
                            px-4 py-1.5 
                            sm:px-6 sm:py-3
                            text-xs sm:text-sm font-semibold
                            bg-[var(--accent-purple)] text-white 
                            rounded-lg hover:bg-[var(--accent-purple-hover)]
                            transition shadow-md hover:shadow-xl 
                            active:scale-95
                        "
                    >
                        Khám Phá Dự Án
                        <ArrowRight className="ml-1 sm:ml-2" size={16} />
                    </Link>

                    {/* Secondary CTA */}
                    <button
                        className="
                            flex items-center gap-2 
                            px-4 py-1.5 
                            sm:px-6 sm:py-3
                            text-xs sm:text-sm
                            text-gray-200 border border-white/30 
                            rounded-lg backdrop-blur-sm
                            hover:bg-white/10 transition active:scale-95
                        "
                    >
                        <div
                            className="
                                w-6 h-6 sm:w-8 sm:h-8 
                                flex items-center justify-center
                                border border-gray-300/50 rounded-full
                            "
                        >
                            <Play size={10} />
                        </div>
                        Watch Demo
                    </button>
                </div>

            </div>

        </div>
    );
};

export default Hero;
