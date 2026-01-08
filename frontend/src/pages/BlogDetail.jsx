import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as blogService from '../services/blogPosts.service';
import { Calendar, User, Clock } from 'lucide-react';

const BlogDetail = () => {
    const { slug } = useParams();
    const { t, i18n } = useTranslation();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await blogService.getBySlug(slug);
                setPost(data);
            } catch (error) {
                console.error('Error fetching blog post:', error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchPost();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-2xl text-[var(--text-primary)]">Loading...</div>
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen pt-20 flex items-center justify-center">
                <div className="text-2xl text-[var(--text-primary)]">Post not found</div>
            </div>
        );
    }

    const title = i18n.language === 'vi' ? post.titleVi : post.titleEn;
    const content = i18n.language === 'vi' ? post.contentVi : post.contentEn;

    return (
        <div className="min-h-screen pt-20 pb-16 bg-[var(--bg-primary)]">
            {/* Header / Hero */}
            <div className="relative h-[400px] w-full mb-12">
                <div className="absolute inset-0">
                    <img
                        src={post.thumbnailUrl?.startsWith('http') ? post.thumbnailUrl : `${import.meta.env.VITE_API_URL}${post.thumbnailUrl}`}
                        alt={title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60"></div>
                </div>
                <div className="relative container mx-auto px-4 h-full flex flex-col justify-end pb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 max-w-4xl leading-tight">
                        {title}
                    </h1>
                    <div className="flex items-center gap-6 text-gray-300">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} />
                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User size={18} />
                            <span>Admin</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Body */}
            <div className="container mx-auto px-4 max-w-4xl">
                <article className="prose dark:prose-invert prose-lg max-w-none prose-img:rounded-xl prose-img:shadow-lg prose-a:text-blue-600 prose-headings:font-bold prose-headings:text-[var(--text-primary)] text-[var(--text-secondary)]">
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </article>
            </div>
        </div>
    );
};

export default BlogDetail;
