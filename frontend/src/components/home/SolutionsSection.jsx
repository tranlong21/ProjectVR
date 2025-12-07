import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const SolutionsSection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const solutions = [
        { title: "VR for Tourism", img: "/assets/images/tourism_360_tour.png", desc: "Transport travelers to destinations before they book with immersive 360 tours." },
        { title: "VR for Real Estate", img: "/assets/images/virtual_showroom_project.png", desc: "Showcase properties to buyers anywhere in the world with interactive walkthroughs." },
        { title: "VR for Education", img: "/assets/images/vr_education_training.png", desc: "Enhance learning retention with immersive, hands-on educational experiences." },
    ];

    return (
        <section className="py-24 relative bg-[var(--bg-secondary)] overflow-hidden transition-colors duration-300">
            {/* Background Elements */}
            <div className="absolute right-0 bottom-0 w-96 h-96 bg-[var(--accent-purple)] rounded-full blur-[150px] opacity-5 pointer-events-none"></div>

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
                            {t('nav.solutions') || "Industry Solutions"}
                        </h2>
                        <div className="h-1 w-24 bg-[var(--accent-purple)] rounded"></div>
                    </div>
                    <Link to="/solutions" className="hidden md:flex items-center text-[var(--accent-purple)] hover:text-[var(--accent-purple-hover)] transition-colors font-bold text-lg">
                        View All Solutions <ArrowRight className="ml-2" size={20} />
                    </Link>
                </div>

                <div className="space-y-24">
                    {solutions.map((solution, index) => (
                        <div key={index} className={`flex flex-col ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} items-center gap-12 lg:gap-20 group`}>
                            <div className="w-full lg:w-1/2">
                                <div className="relative rounded-2xl overflow-hidden border border-[var(--border-color)] shadow-xl transform transition-transform duration-500 group-hover:scale-[1.02]">
                                    <div className="absolute inset-0 bg-[var(--accent-purple)]/20 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"></div>
                                    <img
                                        src={solution.img}
                                        alt={solution.title}
                                        className="w-full h-auto object-cover aspect-video transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                    />
                                    {/* Tech Overlay */}
                                    <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/90 to-transparent z-20 translate-y-full group-hover:translate-y-0 transition-transform duration-500">
                                        <div className="flex items-center gap-2 text-[var(--accent-purple)] font-mono text-sm">
                                            <span className="w-2 h-2 bg-[var(--accent-purple)] rounded-full animate-pulse"></span>
                                            LIVE PREVIEW
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full lg:w-1/2 space-y-6">
                                <h3 className="text-3xl md:text-4xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors">
                                    {solution.title}
                                </h3>
                                <p className="text-lg text-[var(--text-secondary)] leading-relaxed">
                                    {solution.desc}
                                </p>
                                <ul className="space-y-3 text-[var(--text-secondary)]">
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)]"></div>
                                        <span>Increased engagement by 400%</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-purple)]"></div>
                                        <span>Reduced travel costs</span>
                                    </li>
                                </ul>

                                {/* FIXED BUTTON — navigate instead of router.push */}
                                <button
                                    onClick={() => navigate("/solutions")}
                                    className="pt-4 flex items-center text-[var(--text-primary)] font-bold hover:text-[var(--accent-purple)] transition-colors group/btn"
                                >
                                    {t("common.read_more")}
                                    <ArrowRight className="ml-2 group-hover/btn:translate-x-2 transition-transform" size={20} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center md:hidden">
                    <Link to="/solutions" className="inline-flex items-center text-[var(--accent-purple)] hover:text-[var(--accent-purple-hover)] transition-colors font-bold text-lg">
                        View All Solutions <ArrowRight className="ml-2" size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default SolutionsSection;
