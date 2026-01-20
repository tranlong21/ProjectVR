import React, { useState, useEffect } from 'react';
import * as blogService from '../../services/blogPosts.service';
import {
    Save,
    ArrowLeft,
    Layers,
    Image as ImageIcon,
    Sparkles,
    ChevronUp,
    ChevronDown
} from 'lucide-react';
import RichTextEditor from '../../components/admin/RichTextEditor';
import ImageSelector from '../../components/admin/ImageSelector';
import { useNavigate } from 'react-router-dom';

const AdminBlog = () => {
    const navigate = useNavigate();

    const [posts, setPosts] = useState([]);
    const [mode, setMode] = useState('LIST');
    const [loading, setLoading] = useState(false);
    const [aiLoading, setAiLoading] = useState(false);
    const [showThumbnailSelector, setShowThumbnailSelector] = useState(false);
    const [isAiConfigOpen, setIsAiConfigOpen] = useState(true);


    const [formData, setFormData] = useState({
        id: null,
        titleVi: '',
        titleEn: '',
        slug: '',
        thumbnailUrl: '',
        contentVi: '',
        contentEn: ''
    });

    /** ================= AI CONFIG ================= */
    const [aiConfig, setAiConfig] = useState({
        topic: '',
        minWords: 600,
        maxWords: 800,
        audience: 'kỹ sư xây dựng, QS, PM'
    });
    /** ============================================ */

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const data = await blogService.getAll();
            setPosts(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setMode('CREATE');
        setIsAiConfigOpen(true);
        setFormData({
            id: null,
            titleVi: '',
            titleEn: '',
            slug: '',
            thumbnailUrl: '',
            contentVi: '',
            contentEn: ''
        });
        setAiConfig({
            topic: '',
            minWords: 600,
            maxWords: 800,
            audience: 'kỹ sư xây dựng, QS, PM'
        });
    };

    const handleEdit = (post) => {
        setMode('EDIT');
        setIsAiConfigOpen(false);
        setFormData({ ...post, slug: post.slug || '' });
    };

    const handleBack = () => {
        if (window.confirm('Unsaved changes will be lost. Go back?')) {
            setMode('LIST');
            fetchPosts();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (mode === 'CREATE') {
                await blogService.create(formData);
                alert('Post created!');
            } else {
                await blogService.update(formData.id, formData);
                alert('Post updated!');
            }
            setMode('LIST');
            fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Error saving post');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this post?')) return;
        try {
            await blogService.remove(id);
            setPosts(posts.filter(p => p.id !== id));
        } catch (e) {
            alert('Delete failed');
        }
    };

    const handleThumbnailSelect = (image) => {
        setFormData(prev => ({ ...prev, thumbnailUrl: image.url }));
        setShowThumbnailSelector(false);
    };

    /** ================= AI GENERATE ================= */
    const handleGenerateAI = async () => {
        if (!formData.titleVi || !aiConfig.topic) {
            alert('Vui lòng nhập Tiêu đề và Chủ đề triển khai');
            return;
        }

        setAiLoading(true);

        try {
            const response = await blogService.generateByAI({
                title: formData.titleVi,
                topic: aiConfig.topic,
                minWords: aiConfig.minWords,
                maxWords: aiConfig.maxWords,
                audience: aiConfig.audience
            });

            setFormData(prev => ({
                ...prev,
                contentVi: response.contentVi
            }));

            setIsAiConfigOpen(false);
        } catch (e) {
            console.error(e);
            alert('AI generation failed');
        } finally {
            setAiLoading(false);
        }
    };
    /** ============================================== */

    // Auto slug
    useEffect(() => {
        if (mode === 'CREATE' && formData.titleVi) {
            const slug = formData.titleVi
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .replace(/đ/g, 'd')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setFormData(prev => ({ ...prev, slug }));
        }
    }, [formData.titleVi, mode]);

    if (mode === 'LIST') {
        return (
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold dark:text-white">
                        Blog Management
                    </h1>
                    <button
                        onClick={handleCreate}
                        className="px-4 py-2 bg-[#9b4dff] text-white rounded-lg flex items-center gap-2"
                    >
                        <Layers size={20} /> New Post
                    </button>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs">ID</th>
                                <th className="px-6 py-3 text-left text-xs">Title (VI)</th>
                                <th className="px-6 py-3 text-right text-xs">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {posts.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-3">{p.id}</td>
                                    <td className="px-6 py-3 font-medium">{p.titleVi}</td>
                                    <td className="px-6 py-3 text-right">
                                        <button
                                            onClick={() => handleEdit(p)}
                                            className="text-blue-600 mr-4"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(p.id)}
                                            className="text-red-600"
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
        <form
            onSubmit={handleSubmit}
            className="min-h-screen space-y-6"
        >
            {/* ================= HEADER – FULL WIDTH ================= */}
            <div className="flex items-center gap-4">
                <button type="button" onClick={handleBack}>
                    <ArrowLeft />
                </button>
                <h1 className="text-2xl font-bold dark:text-white">
                    {mode === 'CREATE' ? 'Add New Post' : 'Edit Post'}
                </h1>
            </div>

            {/* ================= BODY – 2 COLUMNS ================= */}
            <div className="flex flex-col lg:flex-row gap-6">

                {/* ========== LEFT PANEL ========== */}
                <div className="flex-1 flex flex-col gap-4 pr-2">

                    {/* TITLE + AI CONFIG */}
                    <div className="bg-white dark:bg-slate-800 rounded shadow overflow-hidden">

                        {/* TITLE */}
                        <div className="p-4 flex items-center gap-4">
                            <input
                                value={formData.titleVi}
                                onChange={e =>
                                    setFormData({ ...formData, titleVi: e.target.value })
                                }
                                placeholder="Tiêu đề bài viết"
                                className="flex-1 text-xl font-bold p-2 border rounded bg-transparent dark:text-white"
                                required
                            />

                            <button
                                type="button"
                                onClick={() => setIsAiConfigOpen(!isAiConfigOpen)}
                                className="flex items-center gap-1 text-sm text-gray-400 hover:text-white"
                            >
                                {isAiConfigOpen ? 'Thu gọn' : 'Mở rộng'}
                                {isAiConfigOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                        </div>

                        {/* AI CONFIG */}
                        {isAiConfigOpen && (
                            <div className="border-t dark:border-slate-700 bg-slate-800/40">
                                <div className="ml-4 mt-2 flex items-center gap-2 text-s text-purple-400">
                                    <Sparkles size={14} />
                                    <span>AI hỗ trợ viết nội dung</span>
                                </div>

                                <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto">
                                    <textarea
                                        value={aiConfig.topic}
                                        onChange={e =>
                                            setAiConfig({ ...aiConfig, topic: e.target.value })
                                        }
                                        placeholder="Chủ đề triển khai nội dung (AI)"
                                        className="w-full p-2 border rounded bg-transparent dark:text-white"
                                        rows={2}
                                    />

                                    <div className="flex gap-4">
                                        <input
                                            type="number"
                                            value={aiConfig.minWords}
                                            onChange={e =>
                                                setAiConfig({
                                                    ...aiConfig,
                                                    minWords: +e.target.value
                                                })
                                            }
                                            placeholder="Số từ tối thiểu"
                                            className="w-1/2 p-2 border rounded bg-transparent dark:text-white"
                                        />
                                        <input
                                            type="number"
                                            value={aiConfig.maxWords}
                                            onChange={e =>
                                                setAiConfig({
                                                    ...aiConfig,
                                                    maxWords: +e.target.value
                                                })
                                            }
                                            placeholder="Số từ tối đa"
                                            className="w-1/2 p-2 border rounded bg-transparent dark:text-white"
                                        />
                                    </div>

                                    <input
                                        value={aiConfig.audience}
                                        onChange={e =>
                                            setAiConfig({
                                                ...aiConfig,
                                                audience: e.target.value
                                            })
                                        }
                                        placeholder="Đối tượng đọc (VD: kỹ sư xây dựng, QS, PM...)"
                                        className="w-full p-2 border rounded bg-transparent dark:text-white"
                                    />
                                </div>

                                <div className="p-4 border-t dark:border-slate-700 bg-slate-900">
                                    <button
                                        type="button"
                                        onClick={handleGenerateAI}
                                        disabled={aiLoading}
                                        className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded font-semibold text-white
                                    ${aiLoading
                                                ? 'bg-gray-500 cursor-not-allowed'
                                                : 'bg-purple-600 hover:bg-purple-700'
                                            }
                                `}
                                    >
                                        ✨ {aiLoading ? 'Đang tạo nội dung... (Quá trình có thể mất vài phút, tùy vào độ dài bài viết.)' : 'Tạo nội dung bằng AI'}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* EDITOR – AUTO HEIGHT */}
                    <div>
                        <RichTextEditor
                            value={formData.contentVi}
                            onChange={val =>
                                setFormData(prev => ({ ...prev, contentVi: val }))
                            }
                        />
                    </div>
                </div>

                {/* ========== RIGHT PANEL ========== */}
                <div className="w-full lg:w-80 flex flex-col gap-4">

                    <div className="bg-white dark:bg-slate-800 p-4 rounded shadow">
                        <button
                            type="submit"
                            className="w-full py-2 bg-blue-600 text-white rounded"
                        >
                            <Save size={16} /> {mode === 'CREATE' ? 'Publish' : 'Update'}
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded shadow">
                        <h3 className="font-bold mb-2">Slug</h3>
                        <input
                            value={formData.slug}
                            onChange={e =>
                                setFormData({ ...formData, slug: e.target.value })
                            }
                            className="w-full p-2 border rounded bg-gray-50 dark:bg-slate-900"
                        />
                    </div>

                    <div className="bg-white dark:bg-slate-800 p-4 rounded shadow">
                        <h3 className="font-bold mb-2">Featured Image</h3>
                        {formData.thumbnailUrl ? (
                            <img
                                src={
                                    formData.thumbnailUrl.startsWith('http')
                                        ? formData.thumbnailUrl
                                        : `${import.meta.env.VITE_API_URL}${formData.thumbnailUrl}`
                                }
                                onClick={() => setShowThumbnailSelector(true)}
                                className="w-full rounded cursor-pointer"
                            />
                        ) : (
                            <div
                                onClick={() => setShowThumbnailSelector(true)}
                                className="border-2 border-dashed p-6 text-center cursor-pointer"
                            >
                                <ImageIcon />
                                <p>Set featured image</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
