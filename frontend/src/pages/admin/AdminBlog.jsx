
import React, { useState, useEffect } from 'react';
import * as blogPostsService from '../../services/blogPosts.service';
import {
    Plus, Edit, Trash2, Search, Eye, Code, Wand2, FileText, Loader2
} from 'lucide-react';

import Modal from '../../components/admin/Modal';
import { getThumbnailUrl } from '../../utils/fileUtils';
import VisualEditor from '../../components/admin/blog/VisualEditor';
import HtmlEditor from '../../components/admin/blog/HtmlEditor';
import AIGenerator from '../../components/admin/blog/AIGenerator';

const EMPTY_CONTENT_SOURCE = JSON.stringify({ blocks: [] });

const AdminBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false); // Thêm loading khi save
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [editorMode, setEditorMode] = useState('visual'); // visual | html | ai
    const [statusFilter, setStatusFilter] = useState('ALL');

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        thumbnailUrl: '',
        contentSource: EMPTY_CONTENT_SOURCE,
        rawInput: '',
        useAI: false // Thêm field này
    });

    useEffect(() => {
        fetchPosts();
    }, [statusFilter]);

    const fetchPosts = async () => {
        try {
            const data = statusFilter === 'ALL'
                ? await blogPostsService.getAllAdmin()
                : await blogPostsService.getByStatus(statusFilter);
            setPosts(data);
        } catch (err) {
            console.error('Fetch posts error:', err);
            alert('Không tải được danh sách bài viết');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (post = null) => {
        if (post) {
            setEditingPost(post);
            setFormData({
                title: post.title || '',
                slug: post.slug || '',
                thumbnailUrl: post.thumbnailUrl || '',
                contentSource: post.contentSource || EMPTY_CONTENT_SOURCE,
                rawInput: '',
                useAI: false
            });
            setPreviewUrl(getThumbnailUrl(post.thumbnailUrl));
            setEditorMode('visual');
        } else {
            setEditingPost(null);
            setFormData({
                title: '',
                slug: '',
                thumbnailUrl: '',
                contentSource: EMPTY_CONTENT_SOURCE,
                rawInput: '',
                useAI: false
            });
            setPreviewUrl(null);
            setEditorMode('visual');
        }
        setThumbnailFile(null);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setEditingPost(null);
        setThumbnailFile(null);
        setPreviewUrl(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Auto generate slug từ title
    useEffect(() => {
        if (!editingPost && formData.title && !formData.slug) {
            const generated = formData.title
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '');
            setFormData(prev => ({ ...prev, slug: generated }));
        }
    }, [formData.title, editingPost]);

    const handleContentSourceChange = (value) => {
        const normalized = typeof value === 'string' ? value : JSON.stringify(value);
        setFormData(prev => ({ ...prev, contentSource: normalized }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setSaving(true);

        try {
            // Validate cơ bản
            if (!formData.title.trim()) throw new Error('Tiêu đề không được để trống');
            if (!formData.slug.trim()) throw new Error('Slug không được để trống');

            let savedPost;

            if (!editingPost) {
                // ================== TẠO MỚI ==================
                const createPayload = {
                    title: formData.title.trim(),
                    slug: formData.slug.trim(),
                    thumbnailUrl: formData.thumbnailUrl || undefined,
                    // Quan trọng: gửi useAI và rawInput khi ở mode AI
                    useAI: editorMode === 'ai' ? true : undefined,
                    rawInput: editorMode === 'ai' ? formData.rawInput.trim() : undefined,
                    // Chỉ gửi contentSource khi không dùng AI
                    contentSource: editorMode !== 'ai' ? formData.contentSource : undefined,
                };

                savedPost = await blogPostsService.create(createPayload);

            } else {
                // ================== CẬP NHẬT ==================
                if (editorMode === 'html') {
                    // Dùng API riêng cho HTML
                    savedPost = await blogPostsService.updateFromHtml(editingPost.id, formData.contentSource);
                } else {
                    // Visual hoặc AI (sau khi đã có contentSource)
                    const updatePayload = {
                        title: formData.title.trim(),
                        slug: formData.slug.trim(),
                        thumbnailUrl: formData.thumbnailUrl || undefined,
                        contentSource: formData.contentSource
                    };
                    savedPost = await blogPostsService.update(editingPost.id, updatePayload);
                }
            }

            // Upload thumbnail nếu có file mới
            if (thumbnailFile) {
                savedPost = await blogPostsService.updateThumbnail(savedPost.id, thumbnailFile);
            }

            await fetchPosts();
            handleCloseModal();
            alert(editingPost ? 'Cập nhật thành công!' : 'Tạo bài viết thành công!');

        } catch (err) {
            console.error('Save error:', err);
            const msg = err?.response?.data?.error || err.message || 'Lỗi không xác định';
            alert('Lỗi: ' + msg);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Xóa bài viết này?')) return;
        try {
            await blogPostsService.remove(id);
            await fetchPosts();
        } catch (err) {
            alert('Xóa thất bại');
        }
    };

    const handleStatusChange = async (id, status) => {
        try {
            await blogPostsService.updateStatus(id, status);
            await fetchPosts();
        } catch (err) {
            alert('Cập nhật trạng thái thất bại');
        }
    };

    const handleThumbnailSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setThumbnailFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    // Khi chuyển sang mode AI → reset contentSource
    useEffect(() => {
        if (editorMode === 'ai' && !editingPost) {
            setFormData(prev => ({ ...prev, contentSource: EMPTY_CONTENT_SOURCE }));
        }
    }, [editorMode, editingPost]);

    const filteredPosts = posts.filter(p =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.slug?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && posts.length === 0) {
        return <div className="text-center py-12">Đang tải...</div>;
    }

    return (
        <div className="space-y-6 p-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Quản lý Blog</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-lg flex items-center gap-2 transition"
                >
                    <Plus size={20} /> Tạo bài mới
                </button>
            </div>

            <input
                placeholder="Tìm kiếm theo tiêu đề hoặc slug..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full max-w-md border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Tiêu đề</th>
                            <th className="px-4 py-3 text-left">Slug</th>
                            <th className="px-4 py-3 text-left">Trạng thái</th>
                            <th className="px-4 py-3 text-left">Thumbnail</th>
                            <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredPosts.map(p => (
                            <tr key={p.id} className="border-t hover:bg-gray-50">
                                <td className="px-4 py-3">{p.id}</td>
                                <td className="px-4 py-3 font-medium">{p.title}</td>
                                <td className="px-4 py-3 text-sm text-gray-600">{p.slug}</td>
                                <td className="px-4 py-3">
                                    <select
                                        value={p.status}
                                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                                        className="px-3 py-1 rounded border text-sm"
                                    >
                                        <option value="DRAFT">Draft</option>
                                        <option value="PUBLISHED">Published</option>
                                        <option value="ARCHIVED">Archived</option>
                                    </select>
                                </td>
                                <td className="px-4 py-3">
                                    {p.thumbnailUrl && (
                                        <img src={getThumbnailUrl(p.thumbnailUrl)} alt="" className="h-12 w-20 object-cover rounded" />
                                    )}
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <button onClick={() => handleOpenModal(p)} className="text-blue-600 hover:text-blue-800 mr-4">
                                        <Edit size={18} />
                                    </button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* MODAL */}
            <Modal isOpen={showModal} onClose={handleCloseModal} title={editingPost ? 'Sửa bài viết' : 'Tạo bài viết mới'} size="xl">
                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block font-medium mb-1">Tiêu đề *</label>
                            <input
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={saving}
                            />
                        </div>
                        <div>
                            <label className="block font-medium mb-1">Slug *</label>
                            <input
                                name="slug"
                                value={formData.slug}
                                onChange={handleInputChange}
                                className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
                                required
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium mb-1">Thumbnail</label>
                        <input type="file" accept="image/*" onChange={handleThumbnailSelect} disabled={saving} />
                        {previewUrl && (
                            <img src={previewUrl} alt="Preview" className="mt-3 h-40 object-cover rounded-lg" />
                        )}
                    </div>

                    {/* Editor Tabs */}
                    <div className="border-b">
                        <div className="flex gap-6">
                            <button type="button" onClick={() => setEditorMode('visual')} className={`pb-2 px-1 border-b-2 transition ${editorMode === 'visual' ? 'border-blue-600 font-bold' : 'border-transparent'}`}>
                                <FileText size={18} className="inline mr-2" />Visual Editor
                            </button>
                            <button type="button" onClick={() => setEditorMode('html')} className={`pb-2 px-1 border-b-2 transition ${editorMode === 'html' ? 'border-blue-600 font-bold' : 'border-transparent'}`}>
                                <Code size={18} className="inline mr-2" />HTML Editor
                            </button>
                            {!editingPost && (
                                <button type="button" onClick={() => setEditorMode('ai')} className={`pb-2 px-1 border-b-2 transition ${editorMode === 'ai' ? 'border-blue-600 font-bold' : 'border-transparent'}`}>
                                    <Wand2 size={18} className="inline mr-2" />AI Generator
                                </button>
                            )}
                        </div>
                    </div>

                    {editorMode === 'visual' && (
                        <VisualEditor
                            contentSource={formData.contentSource}
                            onChange={handleContentSourceChange}
                        />
                    )}

                    {editorMode === 'html' && (
                        <HtmlEditor
                            contentHtml={editingPost ? editingPost.contentHtml : '<article><h1></h1><p></p></article>'}
                            onChange={handleContentSourceChange}
                        />
                    )}

                    {editorMode === 'ai' && !editingPost && (
                        <AIGenerator
                            formData={formData}
                            onChange={handleInputChange}
                        />
                    )}

                    <div className="flex justify-end gap-4 pt-6">
                        <button type="button" onClick={handleCloseModal} className="px-6 py-3 border rounded-lg" disabled={saving}>
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 disabled:opacity-70"
                        >
                            {saving && <Loader2 className="animate-spin" size={20} />}
                            {editingPost ? 'Cập nhật' : 'Tạo bài viết'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default AdminBlog;