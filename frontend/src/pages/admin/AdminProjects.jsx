import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, Search, Eye, Image as ImageIcon } from 'lucide-react';

const AdminProjects = () => {
    const [projects, setProjects] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        titleVi: '',
        titleEn: '',
        categoryId: '',
        location: '',
        shortDescription: '',
        detailedDescription: '',
        descriptionVi: '',
        descriptionEn: '',
        thumbnailUrl: '',
        featured: false
    });
    const [thumbnailFile, setThumbnailFile] = useState(null);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        fetchProjects();
        fetchCategories();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await api.get('/projects');
            setProjects(response.data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setThumbnailFile(e.target.files[0]);
        }
    };

    const openModal = (project = null) => {
        if (project) {
            setCurrentProject(project);
            setFormData({
                title: project.title || '',
                titleVi: project.titleVi || '',
                titleEn: project.titleEn || '',
                categoryId: project.category?.id || '',
                location: project.location || '',
                shortDescription: project.shortDescription || '',
                detailedDescription: project.detailedDescription || '',
                descriptionVi: project.descriptionVi || '',
                descriptionEn: project.descriptionEn || '',
                thumbnailUrl: project.thumbnailUrl || '',
                featured: project.featured || false
            });
        } else {
            setCurrentProject(null);
            setFormData({
                title: '',
                titleVi: '',
                titleEn: '',
                categoryId: '',
                location: '',
                shortDescription: '',
                detailedDescription: '',
                descriptionVi: '',
                descriptionEn: '',
                thumbnailUrl: '',
                featured: false
            });
        }
        setThumbnailFile(null);
        setActiveTab('general');
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let response;
            const projectData = {
                ...formData,
                category: formData.categoryId ? { id: formData.categoryId } : null
            };

            if (currentProject) {
                response = await api.put(`/admin/projects/${currentProject.id}`, projectData);
            } else {
                response = await api.post('/admin/projects', projectData);
            }

            const projectId = response.data.id;

            // Upload thumbnail if selected
            if (thumbnailFile) {
                const formData = new FormData();
                formData.append('file', thumbnailFile);
                await api.post(`/admin/projects/${projectId}/thumbnail`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            } else if (formData.thumbnailUrl && formData.thumbnailUrl !== currentProject?.thumbnailUrl) {
                // If URL changed but no file, update URL via endpoint
                const formData = new FormData();
                formData.append('url', formData.thumbnailUrl);
                await api.post(`/admin/projects/${projectId}/thumbnail`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
            }

            setIsModalOpen(false);
            fetchProjects();
        } catch (error) {
            console.error('Error saving project:', error);
            alert('Failed to save project');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/admin/projects/${id}`);
                fetchProjects();
            } catch (error) {
                console.error('Error deleting project:', error);
                alert('Failed to delete project');
            }
        }
    };

    const filteredProjects = projects.filter(project =>
        project.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.titleEn?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
                <button
                    onClick={() => openModal()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Project
                </button>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-slate-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Thumbnail</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-slate-600">
                            {filteredProjects.map((project) => (
                                <tr key={project.id} className="hover:bg-gray-50 dark:hover:bg-slate-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {project.thumbnailUrl ? (
                                            <img
                                                src={project.thumbnailUrl.startsWith('http') ? project.thumbnailUrl : `http://localhost:8080${project.thumbnailUrl}`}
                                                alt={project.title}
                                                className="h-12 w-12 rounded object-cover"
                                            />
                                        ) : (
                                            <div className="h-12 w-12 rounded bg-gray-200 dark:bg-slate-600 flex items-center justify-center">
                                                <ImageIcon size={20} className="text-gray-400" />
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{project.title}</div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">{project.titleEn}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                        {project.category?.nameEn || 'Uncategorized'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex gap-1">
                                            {project.has360 && <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">360</span>}
                                            {project.has3d && <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">3D</span>}
                                            {project.featured && <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Featured</span>}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(project)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(project.id)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {currentProject ? 'Edit Project' : 'New Project'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                &times;
                            </button>
                        </div>

                        <div className="p-6">
                            <div className="flex border-b border-gray-200 dark:border-slate-700 mb-6">
                                <button
                                    className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'general' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                    onClick={() => setActiveTab('general')}
                                >
                                    General Info
                                </button>
                                <button
                                    className={`px-4 py-2 border-b-2 font-medium text-sm ${activeTab === 'details' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
                                    onClick={() => setActiveTab('details')}
                                >
                                    Details & Description
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                {activeTab === 'general' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Internal)</label>
                                            <input
                                                type="text"
                                                name="title"
                                                value={formData.title}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                                            <select
                                                name="categoryId"
                                                value={formData.categoryId}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                            >
                                                <option value="">Select Category</option>
                                                {categories.map(cat => (
                                                    <option key={cat.id} value={cat.id}>{cat.nameEn}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (Vietnamese)</label>
                                            <input
                                                type="text"
                                                name="titleVi"
                                                value={formData.titleVi}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (English)</label>
                                            <input
                                                type="text"
                                                name="titleEn"
                                                value={formData.titleEn}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Location</label>
                                            <input
                                                type="text"
                                                name="location"
                                                value={formData.location}
                                                onChange={handleInputChange}
                                                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Thumbnail</label>
                                            <div className="space-y-2">
                                                <input
                                                    type="text"
                                                    name="thumbnailUrl"
                                                    placeholder="Enter URL"
                                                    value={formData.thumbnailUrl}
                                                    onChange={handleInputChange}
                                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                />
                                                <div className="text-center text-sm text-gray-500">OR</div>
                                                <input
                                                    type="file"
                                                    onChange={handleFileChange}
                                                    accept="image/*"
                                                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="featured"
                                                checked={formData.featured}
                                                onChange={handleInputChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                            />
                                            <label className="ml-2 block text-sm text-gray-900 dark:text-gray-300">Featured Project</label>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'details' && (
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Short Description</label>
                                            <textarea
                                                name="shortDescription"
                                                value={formData.shortDescription}
                                                onChange={handleInputChange}
                                                rows="3"
                                                className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Vietnamese)</label>
                                                <textarea
                                                    name="descriptionVi"
                                                    value={formData.descriptionVi}
                                                    onChange={handleInputChange}
                                                    rows="6"
                                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (English)</label>
                                                <textarea
                                                    name="descriptionEn"
                                                    value={formData.descriptionEn}
                                                    onChange={handleInputChange}
                                                    rows="6"
                                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                                    <button
                                        type="button"
                                        onClick={() => setIsModalOpen(false)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        Save Project
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProjects;
