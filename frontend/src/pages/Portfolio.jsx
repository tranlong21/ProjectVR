import React from 'react';
import { useTranslation } from 'react-i18next';

const Portfolio = () => {
    const { t } = useTranslation();

    // Mock portfolio data using local images
    const projects = [
        { id: 1, title: "Luxury Apartment", img: "/assets/images/virtual_showroom_project.png", category: "Real Estate" },
        { id: 2, title: "National Museum", img: "/assets/images/tourism_360_tour.png", category: "Tourism" },
        { id: 3, title: "Tech Hub", img: "/assets/images/team_collaboration.png", category: "Office" },
        { id: 4, title: "Safety Training", img: "/assets/images/vr_education_training.png", category: "Education" },
        { id: 5, title: "Car Showroom", img: "/assets/images/ar_marketing_demo.png", category: "Automotive" },
        { id: 6, title: "City Tour", img: "/assets/images/vr_hero_banner.png", category: "Tourism" },
    ];

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 px-4">
            <div className="max-w-7xl mx-auto py-12">
                <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 neon-text">{t('nav.portfolio')}</h1>

                {/* Filter Categories (Placeholder) */}
                <div className="flex justify-center space-x-4 mb-12 overflow-x-auto pb-4">
                    {['All', 'Real Estate', 'Tourism', 'Education', 'Industrial'].map((cat) => (
                        <button key={cat} className="px-4 py-2 rounded-full glass-panel hover:bg-[var(--accent-blue)] hover:text-white transition-colors whitespace-nowrap">
                            {cat}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <div key={project.id} className="group relative overflow-hidden rounded-xl neon-border">
                            <img
                                src={project.img}
                                alt={project.title}
                                className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                                onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                                <span className="text-[var(--accent-cyan)] text-sm font-bold uppercase tracking-wider mb-1">{project.category}</span>
                                <h3 className="text-2xl font-bold text-white">{project.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Portfolio;
