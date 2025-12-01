import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Upload, Trash2, Box, ArrowLeft, ExternalLink } from 'lucide-react';
import { useTranslation } from "react-i18next";


const AdminModels = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);
    const { t } = useTranslation();
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFormData, setUploadFormData] = useState({
        name: '',
        descriptionVi: '',
        descriptionEn: '',
        modelUrl: ''
    });
    const [modelFile, setModelFile] = useState(null);
    const [uploadType, setUploadType] = useState('file'); // 'file' or 'url'

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchModels(selectedProject.id);
        } else {
            setModels([]);
        }
    }, [selectedProject]);

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

    const fetchModels = async (projectId) => {
        try {
            const response = await api.get(`/admin/projects/${projectId}/models`);
            setModels(response.data);
        } catch (error) {
            console.error('Error fetching models:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUploadFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setModelFile(e.target.files[0]);
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();

            // Required
            formData.append('name', uploadFormData.name);

            // New fields
            formData.append('descriptionVi', uploadFormData.descriptionVi || "");
            formData.append('descriptionEn', uploadFormData.descriptionEn || "");

            // Upload type
            if (uploadType === 'file' && modelFile) {
                formData.append('file', modelFile);
            } else if (uploadType === 'url' && uploadFormData.modelUrl) {
                formData.append('modelUrl', uploadFormData.modelUrl);
            } else {
                alert('Please select a file or enter a URL');
                return;
            }

            await api.post(`/admin/projects/${selectedProject.id}/models`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });

            // Reset UI
            setIsUploadModalOpen(false);
            setUploadFormData({
                name: '',
                descriptionVi: '',
                descriptionEn: '',
                modelUrl: ''
            });
            setModelFile(null);

            fetchModels(selectedProject.id);

        } catch (error) {
            console.error("Error uploading model:", error);
            alert("Failed to upload model: " + (error.response?.data || error.message));
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this model?')) {
            try {
                await api.delete(`/admin/models/${id}`);
                fetchModels(selectedProject.id);
            } catch (error) {
                console.error('Error deleting model:', error);
                alert('Failed to delete model');
            }
        }
    };

    if (!selectedProject) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">3D Models Management</h1>
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Select a Project</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map(project => (
                            <div
                                key={project.id}
                                onClick={() => setSelectedProject(project)}
                                className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                            >
                                <div className="font-medium text-gray-900 dark:text-white">{project.title}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {project.has3d ? 'Has 3D Model' : 'No 3D Model'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProject.title}</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage 3D Model</p>
                </div>
            </div>

            {models.length === 0 ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center">
                    <Box size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No 3D Model Found</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">This project doesn't have a 3D model yet.</p>
                    <button
                        onClick={() => {
                            if (models.length > 0) {
                                setUploadFormData({
                                    name: models[0].name || '',
                                    descriptionVi: models[0].descriptionVi || '',
                                    descriptionEn: models[0].descriptionEn || '',
                                    modelUrl: models[0].modelUrl || ''
                                });
                            }
                            setIsUploadModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
                    >
                        <Upload size={20} />
                        Upload Model
                    </button>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{models[0].name}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Format: {models[0].format}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        const m = models[0];
                                        setUploadFormData({
                                            name: m?.name || "",
                                            descriptionVi: m?.descriptionVi || "",
                                            descriptionEn: m?.descriptionEn || "",
                                            modelUrl: m?.modelUrl || ""
                                        });
                                        setUploadType(m?.fileUrl ? "file" : "url");
                                        setIsUploadModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                >
                                    {t("model.replace")}
                                </button>
                                <button
                                    onClick={() => handleDelete(models[0].id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">File URL:</span>
                                <a
                                    href={models[0].fileUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline flex items-center gap-1 text-sm break-all"
                                >
                                    {models[0].fileUrl}
                                    <ExternalLink size={14} />
                                </a>
                            </div>
                            {models[0].description && (
                                <div className="mt-4">
                                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">Description:</span>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{models[0].description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {models.length > 0 ? 'Replace 3D Model' : 'Upload 3D Model'}
                            </h2>
                            <button onClick={() => setIsUploadModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">

                            {models.length > 0 && (
                                <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded text-sm mb-4">
                                    <p className="font-semibold">{t("warning")}</p>
                                    <p>- {t("model.replace_warning")}</p>
                                </div>
                            )}

                            {/* Model Name */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={uploadFormData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Description VI */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (VI)</label>
                                <textarea
                                    name="descriptionVi"
                                    value={uploadFormData.descriptionVi}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                />
                            </div>

                            {/* Description EN */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (EN)</label>
                                <textarea
                                    name="descriptionEn"
                                    value={uploadFormData.descriptionEn}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                />
                            </div>

                            {/* Upload Type */}
                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        checked={uploadType === 'file'}
                                        onChange={() => setUploadType('file')}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Upload File</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        checked={uploadType === 'url'}
                                        onChange={() => setUploadType('url')}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">External URL</span>
                                </label>
                            </div>

                            {/* Upload File or URL */}
                            {uploadType === 'file' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        File (.glb, .gltf)
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".glb,.gltf"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        required={uploadType === 'file'}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model URL</label>
                                    <input
                                        type="text"
                                        name="modelUrl"
                                        value={uploadFormData.modelUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://raw.githubusercontent.com/.../model.glb"
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        required={uploadType === 'url'}
                                    />

                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {t("model.raw_url_notice")}
                                        <br />

                                        <a
                                            href="https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Duck/glTF/Duck.gltf
                                        </a>
                                    </p>
                                </div>
                            )}

                            {/* Modal Buttons */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    {models.length > 0 ? 'Replace' : 'Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminModels;
