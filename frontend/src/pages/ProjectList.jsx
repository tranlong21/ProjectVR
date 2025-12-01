import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { ArrowRight, MapPin, Eye } from 'lucide-react';
import { getThumbnailUrl } from '../utils/fileUtils';

const ProjectList = () => {
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState('all');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, projsRes] = await Promise.all([
                    api.get('/categories'),
                    api.get('/projects')
                ]);
                setCategories(catsRes.data);
                setProjects(projsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load projects. Please ensure the backend is running.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getImageUrl = (url) => getThumbnailUrl(url);

    const filteredProjects = activeCategory === 'all'
        ? projects
        : projects.filter(p => p.category?.id === activeCategory);

    if (loading) return <div className="min-h-screen flex items-center justify-center text-[#9b4dff] font-bold">Loading...</div>;
    if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;

    return (
        <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300">
            {/* (A) Hero Banner */}
            <div className="relative w-full h-[60vh] overflow-hidden flex items-center">
                <div className="absolute inset-0 bg-gradient-to-r from-[var(--primary)]/20 to-purple-900/40 z-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-black/50 z-0">
                    <img src="/assets/images/vr_hero_banner.png" alt="VR Banner" className="w-full h-full object-cover blur-sm opacity-60" />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-6 w-full">
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                        {i18n.language === 'vi' ? "Dự Án VR/AR" : "VR/AR Projects"}
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 max-w-2xl border-l-4 border-[var(--primary)] pl-4">
                        {i18n.language === 'vi'
                            ? "Trải Nghiệm 360° & Mô Hình 3D – Khám phá các dự án nổi bật được xây dựng bởi VRPLUS."
                            : "360° Experiences & 3D Models – Explore featured projects built by VRPLUS."}
                    </p>
                </div>
            </div>

            {/* (B) Category Navigation */}
            <div className="sticky top-20 z-30 bg-[var(--background)]/95 backdrop-blur-md border-b border-[var(--border-color)] shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 overflow-x-auto no-scrollbar">
                    <div className="flex space-x-2 md:space-x-4 min-w-max">
                        <button
                            onClick={() => setActiveCategory('all')}
                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === 'all'
                                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-purple-500/30'
                                : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                                }`}
                        >
                            {t('common.all')}
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${activeCategory === cat.id
                                    ? 'bg-[var(--primary)] text-[var(--primary-foreground)] shadow-lg shadow-purple-500/30'
                                    : 'bg-[var(--card)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]'
                                    }`}
                            >
                                {i18n.language === 'vi' ? cat.nameVi : cat.nameEn}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* (C) Project Grid */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <Link key={project.id} to={`/projects/${project.id}`} className="group block h-full">
                            <div className="bg-[var(--card)] rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 border border-[var(--border-color)] hover:border-[var(--primary)] h-full flex flex-col group-hover:-translate-y-2">
                                {/* Thumbnail */}
                                <div className="relative h-64 overflow-hidden">
                                    <img
                                        src={getImageUrl(project.thumbnailUrl)}
                                        alt={project.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                    />

                                    {/* Category Tag */}
                                    <div className="absolute top-4 left-4 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
                                        {project.category?.nameEn || "VR"}
                                    </div>

                                    {/* Badges */}
                                    <div className="absolute top-4 right-4 flex space-x-2 z-10">
                                        {project.has360 && <span className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md border border-white/10">360°</span>}
                                        {project.has3d && <span className="bg-black/60 text-white text-xs px-2 py-1 rounded backdrop-blur-md border border-white/10">3D</span>}
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                        <div className="w-14 h-14 rounded-full bg-[var(--primary)] flex items-center justify-center text-white shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-75">
                                            <Eye size={24} />
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-xl font-bold mb-3 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors line-clamp-2">
                                        {i18n.language === 'vi' ? (project.titleVi || project.title) : (project.titleEn || project.title)}
                                    </h3>

                                    <p className="text-[var(--muted-foreground)] text-sm mb-6 line-clamp-3 flex-grow leading-relaxed">
                                        {project.shortDescription}
                                    </p>

                                    <div className="mt-auto pt-4 border-t border-[var(--border-color)] flex justify-between items-center text-sm">
                                        <span className="flex items-center text-[var(--muted-foreground)]">
                                            <MapPin size={14} className="mr-1 text-[var(--primary)]" />
                                            {project.location || "Virtual Space"}
                                        </span>
                                        <span className="px-4 py-2 rounded-lg bg-[var(--primary)]/10 text-[var(--primary)] font-bold text-xs uppercase tracking-wider group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-foreground)] transition-all duration-300">
                                            {t('home.view_details') || "View Details"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-xl text-[var(--muted-foreground)]">No projects found in this category.</p>
                        <button
                            onClick={() => setActiveCategory('all')}
                            className="mt-4 px-6 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full font-bold hover:bg-[var(--primary)]/90 transition-colors"
                        >
                            View All Projects
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProjectList;
