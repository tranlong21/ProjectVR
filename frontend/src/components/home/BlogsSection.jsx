import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight } from 'lucide-react';
import * as blogPostsService from '../../services/blogPosts.service';
import { getThumbnailUrl } from '../../utils/fileUtils';

const BlogsSection = () => {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const data = await blogPostsService.getAllPublished();
                const blogList = Array.isArray(data) ? data : (data.content || []);
                setBlogs(blogList.slice(0, 3));
            } catch (error) {
                console.error("Error fetching blogs:", error);
            }
        };
        fetchBlogs();
    }, []);

    if (blogs.length === 0) return null;

    return (
        <section className="py-24 bg-[var(--bg-primary)] relative transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-end mb-12">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--text-primary)]">
                            Latest Insights
                        </h2>
                        <p className="text-[var(--text-secondary)]">Trends and updates from the VR/AR world.</p>
                    </div>
                    <Link to="/blog" className="hidden md:flex items-center text-[var(--accent-purple)] hover:text-[var(--accent-purple-hover)] transition-colors font-bold">
                        Read All Articles <ArrowRight className="ml-2" size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {blogs.map((blog) => (
                        <Link key={blog.id} to={`/blog/${blog.slug}`} className="group block h-full">
                            <div className="glass-panel rounded-2xl overflow-hidden h-full flex flex-col hover:-translate-y-2 transition-transform duration-300 border border-[var(--border-color)] hover:border-[var(--accent-purple)]/50 bg-[var(--card-bg)]">
                                <div className="relative h-48 overflow-hidden">
                                    <img
                                        src={getThumbnailUrl(blog.thumbnailUrl)}
                                        alt={blog.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                    />
                                    <div className="absolute top-4 left-4 bg-[var(--accent-purple)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                                        NEWS
                                    </div>
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                                        <span className="flex items-center gap-1"><User size={12} /> {blog.author || "Admin"}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-[var(--text-primary)] group-hover:text-[var(--accent-purple)] transition-colors line-clamp-2">
                                        {blog.title}
                                    </h3>
                                    <p className="text-[var(--text-secondary)] text-sm line-clamp-3 mb-4 flex-grow">
                                        {blog.summary || blog.content?.substring(0, 100) + "..."}
                                    </p>
                                    <span className="text-[var(--accent-purple)] text-sm font-bold flex items-center mt-auto group-hover:translate-x-1 transition-transform">
                                        Read More <ArrowRight size={14} className="ml-1" />
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <div className="mt-8 text-center md:hidden">
                    <Link to="/blog" className="inline-flex items-center text-[var(--accent-purple)] hover:text-[var(--accent-purple-hover)] transition-colors font-bold">
                        Read All Articles <ArrowRight className="ml-2" size={20} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default BlogsSection;
