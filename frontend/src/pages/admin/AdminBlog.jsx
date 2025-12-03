import React, { useState, useEffect } from 'react';
import * as blogPostsService from '../../services/blogPosts.service';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import Modal from '../../components/admin/Modal';
import { getThumbnailUrl } from '../../utils/fileUtils';


const AdminBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);


    // Form states
    const [formData, setFormData] = useState({
        titleVi: '',
        titleEn: '',
        slug: '',
        contentVi: '',
        contentEn: '',
        thumbnailUrl: '/assets/images/vr_hero_banner.png'
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const data = await blogPostsService.getAll();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching blog posts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (post = null) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                titleVi: post.titleVi || '',
                titleEn: post.titleEn || '',
                slug: post.slug || '',
                contentVi: post.contentVi || '',
                contentEn: post.contentEn || '',
                thumbnailUrl: post.thumbnailUrl || '/assets/images/vr_hero_banner.png'
            });
            setPreviewUrl(getThumbnailUrl(post.thumbnailUrl));
        } else {
            setEditingPost(null);
            setFormData({
                titleVi: '',
                titleEn: '',
                slug: '',
                contentVi: '',
                contentEn: '',
                thumbnailUrl: '/assets/images/vr_hero_banner.png'
            });
            setPreviewUrl(null);
        }
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPost(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            let blogId = null;

            // 1) Tạo mới hoặc cập nhật bài viết
            if (editingPost) {
                const data = await blogPostsService.update(editingPost.id, formData);
                blogId = data.id;
            } else {
                const data = await blogPostsService.create(formData);
                blogId = data.id;
            }

            // 2) Nếu có chọn ảnh thì upload thumbnail
            if (thumbnailFile) {
                const thumbnailUrl = await blogPostsService.uploadThumbnail(blogId, thumbnailFile);
                // Cập nhật luôn thumbnail URL
                formData.thumbnailUrl = thumbnailUrl;
            }

            // 3) Refresh
            await fetchPosts();
            handleCloseModal();

            alert(editingPost ? "Blog updated successfully!" : "Blog created successfully!");

        } catch (error) {
            console.error("Error saving blog post:", error);
            alert("Failed to save blog post");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            try {
                await blogPostsService.remove(id);
                fetchPosts();
                alert('Blog post deleted successfully!');
            } catch (error) {
                console.error('Error deleting post:', error);
                alert('Failed to delete post');
            }
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleThumbnailSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnailFile(file);

            const tempUrl = URL.createObjectURL(file);
            setPreviewUrl(tempUrl);
        }
    };

    const filteredPosts = posts.filter(p =>
        p.titleVi?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.titleEn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && posts.length === 0) {
        return <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading blog posts...</div>;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">Manage blog content</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus size={20} />
                    <span>New Post</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Posts Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr className="text-left text-sm font-semibold text-gray-600 dark:text-gray-300">
                                <th className="px-6 py-3">ID</th>
                                <th className="px-6 py-3">Title (VI)</th>
                                <th className="px-6 py-3">Title (EN)</th>
                                <th className="px-6 py-3">Slug</th>
                                <th className="px-6 py-3">Date</th>
                                <th className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-100">{post.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 dark:text-gray-100">{post.titleVi}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{post.titleEn}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">/{post.slug}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                                        {new Date(post.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleOpenModal(post)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={showModal}
                onClose={handleCloseModal}
                title={editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (VI)</label>
                            <input
                                type="text"
                                name="titleVi"
                                value={formData.titleVi}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (EN)</label>
                            <input
                                type="text"
                                name="titleEn"
                                value={formData.titleEn}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Slug</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleInputChange}
                            placeholder="url-friendly-slug"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                            required
                        />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">URL: /blog/{formData.slug || 'your-slug'}</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (VI)</label>
                        <textarea
                            name="contentVi"
                            value={formData.contentVi}
                            onChange={handleInputChange}
                            rows={6}
                            placeholder="Markdown supported"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content (EN)</label>
                        <textarea
                            name="contentEn"
                            value={formData.contentEn}
                            onChange={handleInputChange}
                            rows={6}
                            placeholder="Markdown supported"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleThumbnailSelect}
                            className="dark:text-gray-200"
                        />

                        {(previewUrl || formData.thumbnailUrl) && (
                            <img
                                src={previewUrl || getThumbnailUrl(formData.thumbnailUrl)}
                                alt="Preview"
                                className="mt-3 w-40 rounded border"
                                onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                            />
                        )}
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={handleCloseModal}
                            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : (editingPost ? 'Update Post' : 'Create Post')}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminBlog;
