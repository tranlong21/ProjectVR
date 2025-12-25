import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as blogPostsService from '../services/blogPosts.service';
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
                const data = await blogPostsService.getAllPublished();
                setPosts(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    if (loading) return <div className="text-center mt-20 text-[var(--text-primary)]">{t('common.loading')}</div>;

    // Hàm lấy title theo ngôn ngữ
    const getPostTitle = (post) => {
        if (i18n.language === 'vi' && post.titleVi) return post.titleVi;
        if (i18n.language === 'en' && post.titleEn) return post.titleEn;
        return post.title || 'Untitled';
    };

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
            <PageBanner
                title={t('banners.blog.title')}
                subtitle={t('banners.blog.subtitle')}
                backgroundImage="/assets/images/vr_hero_banner.png"
            />
            <div className="max-w-7xl mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {posts.length === 0 ? (
                        <p className="col-span-full text-center text-[var(--text-secondary)]">
                            {t('blog.noPosts') || 'Chưa có bài viết nào'}
                        </p>
                    ) : (
                        posts.map((post) => (
                            <Link
                                key={post.id}
                                to={`/blog/${post.slug}`}
                                className="group flex flex-col h-full glass-panel rounded-xl overflow-hidden hover:-translate-y-2 transition-transform duration-300"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={getThumbnailUrl(post.thumbnailUrl)}
                                        alt={getPostTitle(post)}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center text-sm text-[var(--text-secondary)] mb-3">
                                        <Calendar size={14} className="mr-2" />
                                        {new Date(post.createdAt).toLocaleDateString(i18n.language === 'vi' ? 'vi-VN' : 'en-US')}
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-[var(--accent-blue)] transition-colors">
                                        {getPostTitle(post)}
                                    </h2>
                                    <div className="mt-auto pt-4 flex items-center text-[var(--accent-blue)] font-medium">
                                        {t('blog.readMore') || 'Read More'} 
                                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogList;