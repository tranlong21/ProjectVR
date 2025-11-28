import React from 'react';
import { useTranslation } from 'react-i18next';
import PageBanner from '../components/PageBanner';

const Solutions = () => {
    const { t } = useTranslation();

    const solutions = [
        { title: "VR for Tourism", img: "/assets/images/tourism_360_tour.png", desc: "Transport travelers to destinations before they book." },
        { title: "VR for Real Estate", img: "/assets/images/virtual_showroom_project.png", desc: "Showcase properties to buyers anywhere in the world." },
        { title: "VR for Education", img: "/assets/images/vr_education_training.png", desc: "Immersive learning experiences for better retention." },
        { title: "VR for Museum", img: "/assets/images/vr_hero_banner.png", desc: "Preserve heritage and make museums accessible to all." },
        { title: "VR for Industry", img: "/assets/images/team_collaboration.png", desc: "Safety training and remote operations visualization." },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            <PageBanner
                title={t('banners.solutions.title')}
                subtitle={t('banners.solutions.subtitle')}
                backgroundImage="/assets/images/tourism_360_tour.png"
            />
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="space-y-20">
                    {solutions.map((solution, index) => (
                        <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12`}>
                            <div className="w-full md:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden neon-border group">
                                    <img
                                        src={solution.img}
                                        alt={solution.title}
                                        className="w-full h-auto transition-transform duration-700 group-hover:scale-105"
                                        onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60"></div>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 space-y-6">
                                <h2 className="text-3xl font-bold text-[var(--accent-blue)]">{solution.title}</h2>
                                <p className="text-lg text-gray-300 leading-relaxed">
                                    {solution.desc}
                                </p>
                                <button className="px-6 py-2 border border-[var(--accent-purple)] text-[var(--accent-purple)] rounded hover:bg-[var(--accent-purple)] hover:text-white transition-colors">
                                    Learn More
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Solutions;
