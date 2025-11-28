import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../../services/api';

const FeaturedProjectsSection = () => {
    const { t, i18n } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, projsRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/projects')
                ]);
                setCategories(catsRes.data);
                setProjects(projsRes.data);
                setFilteredProjects(projsRes.data.slice(0, 6));
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (activeCategory === 'all') {
            setFilteredProjects(projects.slice(0, 6));
        } else {
            setFilteredProjects(projects.filter(p => p.category?.id === activeCategory).slice(0, 6));
        }
    }, [activeCategory, projects]);

    const getImageUrl = (url) => {
        if (!url) return '/assets/images/vr_hero_banner.png';
        if (url.startsWith('http')) return url;
        if (url.startsWith('/assets')) return url;
        return `http://localhost:8096/api/files/${url}`;
    };

    return (
        <section className="py-24 bg-[var(--bg-primary)] relative transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
                            {t('nav.projects') || "Featured Projects"}
                        </h2>
                        <div className="h-1 w-24 bg-[var(--accent-purple)] rounded mb-4"></div>
                        <p className="text-[var(--text-secondary)] text-lg">Explore our latest immersive experiences.</p>
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === 'all' ? 'bg-[var(--accent-purple)] text-white shadow-lg' : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'}`}
                        >
                            All
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === cat.id ? 'bg-[var(--accent-purple)] text-white shadow-lg' : 'bg-gray-200 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-white/10'}`}
                            >
                                {i18n.language === 'vi' ? cat.nameVi : cat.nameEn}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <Link key={project.id} to={`/projects/${project.id}`} className="group block h-full">
                            <div className="relative overflow-hidden rounded-2xl aspect-[4/3] mb-4 bg-[var(--card-bg)] border border-[var(--border-color)] transition-all duration-500 hover:-translate-y-3 hover:shadow-xl h-full flex flex-col group-hover:border-[var(--accent-purple)]/50">
                                <div className="relative h-64 overflow-hidden">
                                    <div className="absolute inset-0 bg-black/10 dark:bg-black/20 z-10 group-hover:bg-transparent transition-colors"></div>
                                    <img
                                        src={getImageUrl(project.thumbnailUrl)}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                    />
                                    <div className="absolute top-4 right-4 z-20 bg-[var(--accent-purple)] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                                        {project.category?.nameEn || "VR"}
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
                                        <div className="w-14 h-14 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-white transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100 shadow-lg">
                                            <Eye size={24} />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-2 text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors line-clamp-1">
                                        {i18n.language === 'vi' ? (project.titleVi || project.title) : (project.titleEn || project.title)}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] line-clamp-2 text-sm mb-6 flex-grow">
                                        {project.shortDescription}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-[var(--border-color)] flex justify-between items-center text-sm text-gray-500">
                                        <span className="flex items-center gap-2">
                                            <span className="w-2 h-2 rounded-full bg-[var(--accent-purple)]"></span>
                                            {project.location || "Virtual Space"}
                                        </span>
                                        <span className="group-hover:translate-x-1 transition-transform text-[var(--accent-purple)] font-bold flex items-center">
                                            View Project <ArrowRight size={14} className="ml-1" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-16 text-center">
                    <Link to="/projects" className="inline-flex items-center px-8 py-3 bg-[var(--accent-purple)] text-white rounded-full font-bold hover:bg-[var(--accent-purple-hover)] transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                        View All Projects <ArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjectsSection;
