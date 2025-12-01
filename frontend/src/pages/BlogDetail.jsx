import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getThumbnailUrl } from '../utils/fileUtils';

const BlogDetail = () => {
    const { slug } = useParams();
    const { t, i18n } = useTranslation();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await api.get(`/blog/${slug}`);
                setPost(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) return <div className="text-center mt-20 text-[var(--text-primary)]">{t('common.loading')}</div>;
    if (!post) return <div className="text-center mt-20 text-[var(--text-primary)]">Post not found</div>;

    const title = i18n.language === 'vi' ? post.titleVi : post.titleEn;
    const content = i18n.language === 'vi' ? post.contentVi : post.contentEn;

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto py-8">
                <Link to="/blog" className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--accent-blue)] mb-8 transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Back to Blog
                </Link>

                <div className="mb-8">
                    <div className="flex items-center text-sm text-[var(--text-secondary)] mb-4">
                        <Calendar size={16} className="mr-2" />
                        {new Date(post.createdAt).toLocaleDateString()}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold mb-6 neon-text">{title}</h1>
                </div>

                <div className="rounded-2xl overflow-hidden mb-12 shadow-lg">
                    <img
                        src={getThumbnailUrl(post.thumbnailUrl)}
                        alt={title}
                        className="w-full h-auto object-cover max-h-[500px]"
                        onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                    />
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown>{content}</ReactMarkdown>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
