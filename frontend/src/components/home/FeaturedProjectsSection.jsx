import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Eye } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import * as categoriesService from '../../services/categories.service';
import * as projectsService from '../../services/projects.service';
import { getThumbnailUrl } from '../../utils/fileUtils';

const FeaturedProjectsSection = () => {
    const { t, i18n } = useTranslation();
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('all');
    const [filteredProjects, setFilteredProjects] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cats, projs] = await Promise.all([
                    categoriesService.getAll(),
                    projectsService.getAll()
                ]);
                setCategories(cats);
                setProjects(projs);
                setFilteredProjects(projs.slice(0, 6));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (activeCategory === 'all') {
            setFilteredProjects(projects.slice(0, 6));
        } else {
            setFilteredProjects(
                projects
                    .filter(p => p.category?.id === activeCategory)
                    .slice(0, 6)
            );
        }
    }, [activeCategory, projects]);

    const getImageUrl = (url) => getThumbnailUrl(url);

    return (
        <section className="py-24 bg-[var(--bg-primary)] transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header + Filter */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">

                    {/* Title */}
                    <div className="w-full">
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
                            {t('nav.projects') || 'Featured Projects'}
                        </h2>
                        <div className="h-1 w-24 bg-[var(--accent-purple)] rounded mb-4" />
                        <p className="text-lg text-[var(--text-secondary)]">
                            Explore our latest immersive experiences.
                        </p>
                    </div>

                    {/* Filter Tabs – FIXED DESKTOP 1 ROW */}
                    <div className="w-full md:w-auto">
                        <div
                            className="
                                flex items-center gap-3
                                flex-nowrap
                                overflow-x-auto md:overflow-visible
                                no-scrollbar
                                justify-start md:justify-end
                                max-w-full md:max-w-[720px]
                            "
                        >
                            {/* All */}
                            <button
                                onClick={() => setActiveCategory('all')}
                                className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                                    ${activeCategory === 'all'
                                        ? 'bg-[var(--accent-purple)] text-white shadow-md'
                                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                    }`}
                            >
                                {t('common.all')}
                            </button>

                            {/* Categories */}
                            {categories.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300
                                        ${activeCategory === cat.id
                                            ? 'bg-[var(--accent-purple)] text-white shadow-md'
                                            : 'bg-white/5 text-gray-300 hover:bg-white/10'
                                        }`}
                                >
                                    {i18n.language === 'vi' ? cat.nameVi : cat.nameEn}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map(project => (
                        <Link
                            key={project.id}
                            to={`/projects/${project.id}`}
                            className="group block h-full"
                        >
                            <div className="
                                            group
                                            flex flex-col h-full
                                            glass-panel
                                            rounded-xl
                                            overflow-hidden

                                            border border-[var(--border-color)]
                                            hover:border-[var(--primary)]

                                            hover:-translate-y-2
                                            transition-all duration-300

                                            hover:shadow-[0_0_0_1px_var(--primary),var(--neon-glow)]
                                        ">

                                {/* IMAGE – FIX KHÔNG CO */}
                                <div className="relative aspect-[4/3] overflow-hidden">
                                    <img
                                        src={getImageUrl(project.thumbnailUrl)}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => {
                                            e.target.src = '/assets/images/vr_hero_banner.png';
                                        }}
                                    />

                                    {/* Category */}
                                    <div className="absolute top-4 left-4 bg-[var(--accent-purple)] text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                                        {i18n.language === 'vi'
                                            ? project.category?.nameVi || 'Không rõ'
                                            : project.category?.nameEn || 'Unknown'}
                                    </div>

                                    {/* 360 Badge (nếu có) */}
                                    {project.is360 && (
                                        <div className="absolute top-4 right-4 bg-black/60 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                                            360°
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <div className="w-14 h-14 rounded-full bg-[var(--accent-purple)] flex items-center justify-center text-white scale-0 group-hover:scale-100 transition-transform">
                                            <Eye size={24} />
                                        </div>
                                    </div>
                                </div>

                                {/* CONTENT – ÉP ĐÁY */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-2 line-clamp-1 group-hover:text-[var(--accent-purple)] transition-colors">
                                        {i18n.language === 'vi'
                                            ? project.titleVi || project.title
                                            : project.titleEn || project.title}
                                    </h3>

                                    <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-6">
                                        {project.shortDescription}
                                    </p>

                                    {/* FOOTER – LUÔN Ở ĐÁY */}
                                    <div className="mt-auto pt-4 border-t border-[var(--border-color)] flex justify-between items-center text-sm">
                                        <span className="flex items-center gap-2 text-gray-400">
                                            <span className="w-2 h-2 rounded-full bg-[var(--accent-purple)]" />
                                            {project.location || 'Virtual Space'}
                                        </span>

                                        <span className="flex items-center font-semibold text-[var(--accent-purple)] group-hover:translate-x-1 transition-transform">
                                            Xem chi tiết
                                            <ArrowRight size={14} className="ml-1" />
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All */}
                <div className="mt-16 text-center">
                    <Link
                        to="/projects"
                        className="inline-flex items-center px-8 py-3 bg-[var(--accent-purple)] text-white rounded-full font-bold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                    >
                        View All Projects
                        <ArrowRight className="ml-2" />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default FeaturedProjectsSection;
