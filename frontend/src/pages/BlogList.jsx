import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowRight } from 'lucide-react';
import PageBanner from '../components/PageBanner';
import { getThumbnailUrl } from '../utils/fileUtils';

const BlogList = () => {
    const { t, i18n } = useTranslation();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await api.get('/blog');
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center mt-20 text-[var(--text-primary)]">{t('common.loading')}</div>;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
            <PageBanner
                title={t('banners.blog.title')}
                subtitle={t('banners.blog.subtitle')}
                backgroundImage="/assets/images/vr_hero_banner.png"
            />
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.map((post) => (
                        <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col h-full glass-panel rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300">
                            <div className="h-48 overflow-hidden">
                                <img
                                    src={getThumbnailUrl(post.thumbnailUrl)}
                                    alt={post.titleVi}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex items-center text-sm text-[var(--text-secondary)] mb-3">
                                    <Calendar size={14} className="mr-2" />
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </div>
                                <h2 className="text-xl font-bold mb-3 group-hover:text-[var(--accent-blue)] transition-colors">
                                    {i18n.language === 'vi' ? post.titleVi : post.titleEn}
                                </h2>
                                <div className="mt-auto pt-4 flex items-center text-[var(--accent-blue)] font-medium">
                                    Read More <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BlogList;
