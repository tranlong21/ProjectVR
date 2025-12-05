import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { ArrowRight, Play } from 'lucide-react';

const Hero = () => {
    const { t } = useTranslation();

    return (
        <div className="relative h-screen w-full overflow-hidden bg-black">

            {/* Video Background */}
            <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
            >
                <source src="/assets/video/Untitled.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Content (Bottom Left) */}
            <div className="relative z-20 h-full flex flex-col justify-end 
                pb-12 px-6 md:px-16 lg:px-24 max-w-4xl">

                {/* Badge */}
                <span className="inline-block w-fit mb-3 px-2 py-0.5 rounded-md 
                                border border-[var(--accent-purple)] 
                                text-[10px] md:text-xs uppercase tracking-wider text-[#B8B8E0]">
                    IMMERSIVE REALITY
                </span>

                {/* Heading */}
                <h1 className="text-3xl md:text-5xl font-bold mb-3 leading-tight text-[#E2E2FF]">
                    <span className="block">
                        {t('hero.title') || "Trải Nghiệm Tương Lai Của Thực Tế"}
                    </span>
                    <span className="block text-[var(--accent-purple)]">
                        {t('hero.subtitle_highlight') || "Tương Lai"}
                    </span>
                </h1>

                {/* Subtitle */}
                <p className="text-sm md:text-lg text-[#C8C8F0] mb-6 max-w-lg leading-relaxed">
                    {t('hero.subtitle') || "Giải Pháp VR/AR Đắm Chìm Cho Doanh Nghiệp Và Giải Trí."}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-4">
                    <Link
                        to="/projects"
                        className="inline-flex items-center px-7 py-3 text-sm md:text-base 
                        font-semibold text-white bg-[var(--accent-purple)] rounded-lg 
                        hover:bg-[var(--accent-purple-hover)] transition-all shadow-md"
                    >
                        {t('hero.cta') || "Khám Phá Dự Án"}
                        <ArrowRight className="ml-2" size={18} />
                    </Link>

                    <button className="flex items-center gap-2 px-7 py-3 text-sm md:text-base 
                        text-[#E2E2FF] border border-white/30 rounded-lg 
                        hover:bg-white/10 transition-all backdrop-blur-sm">
                        <div className="w-7 h-7 rounded-full border border-gray-300/50 
                            flex items-center justify-center">
                            <Play size={12} className="text-[#E2E2FF]" />
                        </div>
                        Watch Demo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Hero;
