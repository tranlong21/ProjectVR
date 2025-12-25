import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as blogPostsService from '../services/blogPosts.service';
import { useTranslation } from 'react-i18next';
import { Calendar, ArrowLeft } from 'lucide-react';
import { getThumbnailUrl } from '../utils/fileUtils';

const BlogDetail = () => {
    const { slug } = useParams();
    const { t, i18n } = useTranslation();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await blogPostsService.getBySlug(slug);
                setPost(data);
            } catch (error) {
                console.error('Error fetching blog post:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
    }, [slug]);

    if (loading) {
        return (
            <div className="text-center mt-20 text-[var(--text-primary)]">
                {t('common.loading') || 'Đang tải...'}
            </div>
        );
    }

    if (!post) {
        return (
            <div className="text-center mt-20 text-[var(--text-primary)]">
                {t('blog.notFound') || 'Bài viết không tồn tại'}
            </div>
        );
    }

    // Lấy title đa ngôn ngữ nếu có, fallback về title
    const getTitle = () => {
        if (i18n.language === 'vi' && post.titleVi) return post.titleVi;
        if (i18n.language === 'en' && post.titleEn) return post.titleEn;
        return post.title || 'Untitled';
    };

    const title = getTitle();
    const contentHtml = post.contentHtml || '<p>Nội dung đang được cập nhật...</p>';

    return (
        <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] pt-20 px-4 transition-colors duration-300">
            <div className="max-w-4xl mx-auto py-8">
                {/* Nút quay lại */}
                <Link
                    to="/blog"
                    className="inline-flex items-center text-[var(--text-secondary)] hover:text-[var(--accent-blue)] mb-8 transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    {t('blog.backToList') || 'Back to Blog'}
                </Link>

                {/* Ngày đăng */}
                <div className="flex items-center text-sm text-[var(--text-secondary)] mb-4">
                    <Calendar size={16} className="mr-2" />
                    {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    })}
                </div>

                {/* Tiêu đề */}
                <h1 className="text-3xl md:text-5xl font-bold mb-10 neon-text">
                    {title}
                </h1>

                {/* Thumbnail – luôn hiển thị nếu có */}
                {post.thumbnailUrl ? (
                    <div className="rounded-2xl overflow-hidden mb-12 shadow-2xl border border-[var(--border)]">
                        <img
                            src={getThumbnailUrl(post.thumbnailUrl)}
                            alt={title}
                            className="w-full h-auto object-cover max-h-[600px]"
                            onError={(e) => {
                                e.target.src = '/assets/images/vr_hero_banner.png';
                                e.target.alt = 'Fallback banner';
                            }}
                        />
                    </div>
                ) : (
                    // Optional: hiển thị banner mặc định nếu không có thumbnail
                    <div className="rounded-2xl overflow-hidden mb-12 shadow-2xl">
                        <img
                            src="/assets/images/vr_hero_banner.png"
                            alt="Blog banner"
                            className="w-full h-auto object-cover max-h-[500px]"
                        />
                    </div>
                )}

                {/* Nội dung bài viết */}
                <div
                    className="prose prose-lg dark:prose-invert max-w-none blog-content"
                    dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
            </div>
        </div>
    );
};

export default BlogDetail;