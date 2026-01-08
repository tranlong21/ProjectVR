import React, { useState, useEffect } from 'react';
import * as blogService from '../../services/blogPosts.service';
import { Upload, Save, Eye, ArrowLeft, Layers, Globe, Calendar, Image as ImageIcon, X } from 'lucide-react';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageSelector from '../../components/admin/ImageSelector';
import { useNavigate } from 'react-router-dom';

const AdminBlog = () => {
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);
    const [mode, setMode] = useState('LIST'); // LIST | EDIT | CREATE
    const [loading, setLoading] = useState(false);

    // State for thumbnail selector
    const [showThumbnailSelector, setShowThumbnailSelector] = useState(false);

    const handleThumbnailSelect = (image) => {
        setFormData(prev => ({ ...prev, thumbnailUrl: image.url }));
        setShowThumbnailSelector(false); // Close after selection
    };

    // Editor State
    const [formData, setFormData] = useState({
        id: null,
        titleVi: '',
        titleEn: '',
        slug: '',
        thumbnailUrl: '',
        contentVi: '',
        contentEn: ''
    });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await blogService.getAll();
            setPosts(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setMode('CREATE');
        setFormData({
            id: null,
            titleVi: '',
            titleEn: '',
            slug: '',
            thumbnailUrl: '',
            contentVi: '', // Default content?
            contentEn: ''
        });
    };

    const handleEdit = (post) => {
        setMode('EDIT');
        setFormData({
            ...post,
            slug: post.slug || '' // Ensure not null
        });
    };

    const handleBack = () => {
        if (window.confirm("Unsaved changes will be lost. Go back?")) {
            setMode('LIST');
            fetchPosts();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === 'CREATE') {
                await blogService.create(formData);
                alert("Post created!");
            } else {
                await blogService.update(formData.id, formData);
                alert("Post updated!");
            }
            setMode('LIST');
            fetchPosts();
        } catch (error) {
            alert("Error saving post");
            console.error(error);
        }
    };

    const handleThumbnailUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Draft save first to get ID if creating? 
        // Or implement a generic upload returned URL logic. 
        // Existing service logic: uploadThumbnail requires ID.
        // We will adapt slightly OR assume user must create post first or we change API.
        // However, prompt asks for WP experience. Usually can upload thumb before save?
        // Let's use the new blogImages.service for uploading if we want, OR just use the existing logic.
        // But invalid ID issue.
        // Better: Upload generic, get URL, set string. 

        // Wait, backend `uploadThumbnail` expects ID. 
        // Let's rely on string URL input or separate upload if ID exists.
        // For 'CREATE' mode, we can't use `uploadThumbnail` API yet.
        // WORKAROUND: Use the generic ImageSelector upload for thumbnail too?
        // Or just let them paste URL for now / pick from library.
        alert("Please save the post first to upload a specific thumbnail, or paste a URL.");
    };

    // Auto-generate slug from Vietnamese title instead
    useEffect(() => {
        if (mode === 'CREATE' && formData.titleVi) {
            const slug = formData.titleVi
                .toLowerCase()
                .normalize('NFD') // Decompose
                .replace(/[\u0300-\u036f]/g, '') // Remove accents
                .replace(/đ/g, 'd').replace(/Đ/g, 'D')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.titleVi, mode]);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this blog post?")) {
            try {
                await blogService.remove(id);
                setPosts(posts.filter(p => p.id !== id));
            } catch (error) {
                console.error("Error deleting post:", error);
                alert("Failed to delete post");
            }
        }
    };

    if (mode === 'LIST') {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Management</h1>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-[#9b4dff] text-white rounded-lg hover:bg-[#8a3ee6] flex items-center gap-2"
                    >
                        <Layers size={20} /> New Post
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Title (VI)</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Title (EN - Auto)</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                            {posts.map(post => (
                                <tr key={post.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{post.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{post.titleVi}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400 italic">{post.titleEn || '(Generating...)'}</td>
                                    <td className="px-6 py-4 text-right text-sm">
                                        <button onClick={() => handleEdit(post)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                                        <button
                                            onClick={() => handleDelete(post.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }



    return (
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)]">
            {/* Left Panel: Content */}
            <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
                <div className="flex items-center gap-4">
                    <button type="button" onClick={handleBack} className="p-2 hover:bg-gray-200 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {mode === 'CREATE' ? 'Add New Post' : 'Edit Post'}
                    </h1>
                </div>

                <div className="bg-blue-50 dark:bg-slate-900/50 p-4 rounded text-sm text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 mb-4">
                    <p>ℹ️ <strong>Auto-Translation Active:</strong> You only need to write content in Vietnamese. English title and content will be automatically generated by the system upon saving.</p>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Vietnamese) *</label>
                        <input
                            type="text"
                            value={formData.titleVi}
                            onChange={(e) => setFormData({ ...formData, titleVi: e.target.value })}
                            className="w-full text-xl font-bold p-2 border border-gray-300 dark:border-slate-600 rounded bg-transparent dark:text-white"
                            placeholder="Nhập tiêu đề tiếng Việt"
                            required
                        />
                    </div>
                    {/* Read-only English Title Preview */}
                    {formData.titleEn && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Title (English - Auto Generated)</label>
                            <input
                                type="text"
                                value={formData.titleEn}
                                readOnly
                                disabled
                                className="w-full p-2 text-sm border border-gray-200 dark:border-slate-700 rounded bg-gray-50 dark:bg-slate-900 text-gray-500 italic"
                            />
                        </div>
                    )}
                </div>

                {/* Editor Areas */}
                <div className="space-y-8 pb-10">
                    <div>
                        <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">Content (Vietnamese)</label>
                        <RichTextEditor
                            value={formData.contentVi}
                            onChange={(val) => setFormData(prev => ({ ...prev, contentVi: val }))}
                        />
                    </div>
                </div>
            </div>

            {/* Right Panel: Settings */}
            <div className="w-full lg:w-80 flex flex-col gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Globe size={18} /> Publish
                    </h3>
                    <div className="space-y-4">
                        <button type="submit" className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 flex justify-center items-center gap-2">
                            <Save size={18} /> {mode === 'CREATE' ? 'Publish' : 'Update'}
                        </button>
                        {formData.id && (
                            <a
                                href={`/blog/${formData.slug}`}
                                target="_blank"
                                rel="noreferrer"
                                className="w-full py-2 border border-gray-300 dark:border-slate-600 text-center rounded block hover:bg-gray-50 dark:hover:bg-slate-700 dark:text-white"
                            >
                                Preview Changes
                            </a>
                        )}
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Slug</h3>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full p-2 text-sm border border-gray-300 dark:border-slate-600 rounded bg-gray-50 dark:bg-slate-900 dark:text-gray-300"
                    />
                </div>

                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">Featured Image</h3>
                    {formData.thumbnailUrl ? (
                        <div className="relative group cursor-pointer" onClick={() => setShowThumbnailSelector(true)}>
                            <img
                                src={formData.thumbnailUrl.startsWith('http') ? formData.thumbnailUrl : `${import.meta.env.VITE_API_URL}${formData.thumbnailUrl}`}
                                alt="Thumbnail"
                                className="w-full h-auto rounded border border-gray-200 dark:border-slate-700 hover:opacity-90 transition-opacity"
                            />
                            <div className="absolute top-2 right-2">
                                <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setFormData({ ...formData, thumbnailUrl: '' }); }}
                                    className="bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/30 transition-opacity rounded">
                                <span className="text-white font-medium drop-shadow-md">Change Image</span>
                            </div>
                        </div>
                    ) : (
                        <div
                            onClick={() => setShowThumbnailSelector(true)}
                            className="border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 text-center cursor-pointer hover:border-[#9b4dff] hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
                        >
                            <div className="flex justify-center mb-2">
                                <ImageIcon size={32} className="text-gray-400" />
                            </div>
                            <span className="text-sm font-medium text-[#9b4dff]">Set featured image</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Selector Modal */}
            <ImageSelector
                isOpen={showThumbnailSelector}
                onClose={() => setShowThumbnailSelector(false)}
                onSelect={handleThumbnailSelect}
                usageType="THUMBNAIL"
            />
        </form>
    );
};

export default AdminBlog;
