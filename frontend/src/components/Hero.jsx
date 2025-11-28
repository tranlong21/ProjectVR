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
                className="absolute top-0 left-0 w-full h-full object-cover z-0 opacity-90"
            >
                <source src="/assets/video/Untitled.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {/* Cinematic Overlay - Adaptive Gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent dark:from-black/60 dark:to-transparent z-10"></div>
            <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[var(--bg-primary)] to-transparent z-10"></div>

            {/* Content - Bottom Left Alignment */}
            <div className="relative z-20 h-full flex flex-col justify-end pb-24 md:pb-32 px-6 md:px-16 lg:px-24 max-w-7xl mx-auto">
                <div className="max-w-4xl">
                    {/* Badge */}
                    <div className="flex items-center gap-4 mb-6 animate-fade-in-up">
                        <span className="px-4 py-1.5 rounded-full border border-[var(--accent-purple)] text-white text-sm font-bold tracking-wider uppercase bg-[var(--accent-purple)]/80 backdrop-blur-md shadow-lg">
                            Immersive Reality
                        </span>
                        <div className="h-px w-24 bg-gradient-to-r from-[var(--accent-purple)] to-transparent"></div>
                    </div>

                    {/* Heading */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-white leading-tight animate-fade-in-up delay-100 drop-shadow-2xl">
                        <span className="block text-white">
                            {t('hero.title') || "Experience"}
                        </span>
                        <span className="block text-[var(--accent-purple)] neon-text">
                            {t('hero.subtitle_highlight') || "The Future"}
                        </span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-2xl leading-relaxed animate-fade-in-up delay-200 border-l-4 border-[var(--accent-purple)] pl-6 bg-black/40 backdrop-blur-sm py-2 rounded-r-lg">
                        {t('hero.subtitle') || "Transforming businesses with cutting-edge VR/AR solutions."}
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-wrap gap-6 animate-fade-in-up delay-300">
                        <Link
                            to="/projects"
                            className="group relative inline-flex items-center px-10 py-5 text-lg font-bold text-white bg-[var(--accent-purple)] rounded-lg hover:bg-[var(--accent-purple-hover)] transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1"
                        >
                            <span className="relative z-10 flex items-center">
                                {t('hero.cta') || "Explore Projects"} <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>

                        <button className="group flex items-center gap-4 px-10 py-5 text-lg font-bold text-white border border-white/30 hover:bg-white/10 transition-all rounded-lg backdrop-blur-sm hover:-translate-y-1">
                            <div className="w-10 h-10 rounded-full border border-white/50 flex items-center justify-center group-hover:scale-110 transition-transform bg-white/10">
                                <Play size={16} fill="currentColor" />
                            </div>
                            Watch Demo
                        </button>
                    </div>
                </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-[var(--accent-blue)] rounded-full blur-[180px] opacity-10 animate-pulse-glow z-0 pointer-events-none"></div>
        </div>
    );
};

export default Hero;
