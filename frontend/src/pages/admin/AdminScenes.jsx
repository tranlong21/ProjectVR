import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Plus, Edit, Trash2, MapPin, Image as ImageIcon, ArrowLeft } from 'lucide-react';

const AdminScenes = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [scenes, setScenes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSceneModalOpen, setIsSceneModalOpen] = useState(false);
    const [isHotspotModalOpen, setIsHotspotModalOpen] = useState(false);
    const [currentScene, setCurrentScene] = useState(null);
    const [currentHotspot, setCurrentHotspot] = useState(null);
    const [hotspots, setHotspots] = useState([]);

    // Scene Form Data - ALL fields have default values to prevent controlled/uncontrolled switching
    const [sceneFormData, setSceneFormData] = useState({
        name: '',
        titleVi: '',
        titleEn: '',
        panoramaUrl: '',
        orderIndex: 0,
        initialYaw: 0,
        initialPitch: 0
    });
    const [panoramaFile, setPanoramaFile] = useState(null);
    const [uploadType, setUploadType] = useState('url');

    // Hotspot Form Data - ALL fields have default values
    const [hotspotFormData, setHotspotFormData] = useState({
        type: 'link_scene',
        yaw: 0,
        pitch: 0,
        targetSceneId: '',
        titleVi: '',
        titleEn: '',
        descriptionVi: '',
        descriptionEn: '',
        icon: 'arrow'
    });

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) {
            fetchScenes(selectedProject.id);
        } else {
            setScenes([]);
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

    const fetchScenes = async (projectId) => {
        try {
            const response = await api.get(`/admin/scenes/project/${projectId}`);
            // Sort by orderIndex to ensure correct display order
            const sortedScenes = response.data.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
            setScenes(sortedScenes);
        } catch (error) {
            console.error('Error fetching scenes:', error);
        }
    };

    const handleSceneInputChange = (e) => {
        const { name, value } = e.target;
        setSceneFormData(prev => ({
            ...prev,
            [name]: value ?? ''  // Ensure never undefined
        }));
    };

    const openSceneModal = (scene = null) => {
        if (scene) {
            setCurrentScene(scene);
            // Use nullish coalescing to ensure all values are defined
            setSceneFormData({
                name: scene.name ?? '',
                titleVi: scene.titleVi ?? '',
                titleEn: scene.titleEn ?? '',
                panoramaUrl: scene.panoramaUrl ?? '',
                orderIndex: scene.orderIndex ?? 0,
                initialYaw: scene.initialYaw ?? 0,
                initialPitch: scene.initialPitch ?? 0
            });
        } else {
            setCurrentScene(null);
            // Calculate next order index
            const nextOrderIndex = scenes.length > 0
                ? Math.max(...scenes.map(s => s.orderIndex ?? 0)) + 1
                : 0;
            setSceneFormData({
                name: '',
                titleVi: '',
                titleEn: '',
                panoramaUrl: '',
                orderIndex: nextOrderIndex,
                initialYaw: 0,
                initialPitch: 0
            });
        }
        setPanoramaFile(null);
        setUploadType('url');
        setIsSceneModalOpen(true);
    };

    const handleSceneSubmit = async (e) => {
        e.preventDefault();

        // Validate project selection
        if (!selectedProject || !selectedProject.id) {
            alert('Please select a project first');
            return;
        }

        // Validate required fields
        if (!sceneFormData.name || !sceneFormData.name.trim()) {
            alert('Scene name is required');
            return;
        }

        try {
            let panoramaUrl = sceneFormData.panoramaUrl;

            // Upload panorama file if provided
            if (uploadType === 'file' && panoramaFile) {
                const formData = new FormData();
                formData.append('file', panoramaFile);
                const uploadResponse = await api.post('/files/upload/scenes', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                panoramaUrl = uploadResponse.data.fileUrl || uploadResponse.data;
            }

            // Validate panorama URL
            if (!panoramaUrl || !panoramaUrl.trim()) {
                alert('Panorama URL or file is required');
                return;
            }

            // Construct payload with projectId as direct field
            const sceneData = {
                name: sceneFormData.name,
                titleVi: sceneFormData.titleVi || '',
                titleEn: sceneFormData.titleEn || '',
                panoramaUrl: panoramaUrl,
                orderIndex: parseInt(sceneFormData.orderIndex) || 0,
                initialYaw: parseFloat(sceneFormData.initialYaw) || 0,
                initialPitch: parseFloat(sceneFormData.initialPitch) || 0,
                projectId: selectedProject.id  // Send as direct field
            };

            console.log('Submitting scene data:', sceneData);

            if (currentScene) {
                await api.put(`/admin/scenes/${currentScene.id}`, sceneData);
            } else {
                await api.post('/admin/scenes', sceneData);
            }

            setIsSceneModalOpen(false);
            setPanoramaFile(null);
            setUploadType('url');
            fetchScenes(selectedProject.id);
        } catch (error) {
            console.error('Error saving scene:', error);
            console.error('Error response:', error.response);
            const errorMsg = error.response?.data?.message || error.response?.data || error.message;
            alert('Failed to save scene: ' + errorMsg);
        }
    };

    const handleSceneDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this scene?')) {
            try {
                await api.delete(`/admin/scenes/${id}`);
                fetchScenes(selectedProject.id);
            } catch (error) {
                console.error('Error deleting scene:', error);
                alert('Failed to delete scene');
            }
        }
    };

    // Hotspot Management
    const fetchHotspots = async (sceneId) => {
        try {
            const response = await api.get(`/admin/scenes/${sceneId}/hotspots`);
            setHotspots(response.data);
        } catch (error) {
            console.error('Error fetching hotspots:', error);
        }
    };

    const openHotspotManager = (scene) => {
        setCurrentScene(scene);
        fetchHotspots(scene.id);
        setIsHotspotModalOpen(true);
    };

    const handleHotspotInputChange = (e) => {
        const { name, value } = e.target;
        setHotspotFormData(prev => ({
            ...prev,
            [name]: value ?? ''  // Ensure never undefined
        }));
    };

    const openHotspotForm = (hotspot = null) => {
        if (hotspot) {
            setCurrentHotspot(hotspot);
            setHotspotFormData({
                type: hotspot.type ?? 'link_scene',
                yaw: hotspot.yaw ?? 0,
                pitch: hotspot.pitch ?? 0,
                targetSceneId: hotspot.targetSceneId ?? '',
                titleVi: hotspot.titleVi ?? '',
                titleEn: hotspot.titleEn ?? '',
                descriptionVi: hotspot.descriptionVi ?? '',
                descriptionEn: hotspot.descriptionEn ?? '',
                icon: hotspot.icon ?? 'arrow'
            });
        } else {
            setCurrentHotspot(null);
            setHotspotFormData({
                type: 'link_scene',
                yaw: 0,
                pitch: 0,
                targetSceneId: '',
                titleVi: '',
                titleEn: '',
                descriptionVi: '',
                descriptionEn: '',
                icon: 'arrow'
            });
        }
    };

    const handleHotspotSubmit = async (e) => {
        e.preventDefault();
        try {
            const hotspotData = {
                type: hotspotFormData.type,
                yaw: parseFloat(hotspotFormData.yaw) || 0,
                pitch: parseFloat(hotspotFormData.pitch) || 0,
                targetSceneId: hotspotFormData.targetSceneId ? parseInt(hotspotFormData.targetSceneId) : null,
                titleVi: hotspotFormData.titleVi || '',
                titleEn: hotspotFormData.titleEn || '',
                descriptionVi: hotspotFormData.descriptionVi || '',
                descriptionEn: hotspotFormData.descriptionEn || '',
                icon: hotspotFormData.icon || 'arrow'
            };

            if (currentHotspot) {
                await api.put(`/admin/hotspots/${currentHotspot.id}`, hotspotData);
            } else {
                await api.post(`/admin/scenes/${currentScene.id}/hotspots`, hotspotData);
            }

            fetchHotspots(currentScene.id);
            openHotspotForm(null);
        } catch (error) {
            console.error('Error saving hotspot:', error);
            alert('Failed to save hotspot');
        }
    };

    const handleHotspotDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hotspot?')) {
            try {
                await api.delete(`/admin/hotspots/${id}`);
                fetchHotspots(currentScene.id);
            } catch (error) {
                console.error('Error deleting hotspot:', error);
                alert('Failed to delete hotspot');
            }
        }
    };

    if (!selectedProject) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Scene Management</h1>
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
                                    {project.has360 ? 'Has 360° scenes' : 'No scenes'}
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
                    <p className="text-sm text-gray-500 dark:text-gray-400">Manage Scenes</p>
                </div>
                <button
                    onClick={() => openSceneModal()}
                    className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Scene
                </button>
            </div>

            {/* Scenes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {scenes.map((scene) => (
                    <div key={scene.id} className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden group">
                        <div className="relative h-48 bg-gray-200 dark:bg-slate-700">
                            {scene.panoramaUrl ? (
                                <img
                                    src={scene.panoramaUrl.startsWith('http') ? scene.panoramaUrl : `http://localhost:8096${scene.panoramaUrl}`}
                                    alt={scene.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <ImageIcon size={48} className="text-gray-400" />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                                <button
                                    onClick={() => openSceneModal(scene)}
                                    className="p-2 bg-white rounded-full text-blue-600 hover:text-blue-700"
                                    title="Edit Scene"
                                >
                                    <Edit size={20} />
                                </button>
                                <button
                                    onClick={() => openHotspotManager(scene)}
                                    className="p-2 bg-white rounded-full text-green-600 hover:text-green-700"
                                    title="Manage Hotspots"
                                >
                                    <MapPin size={20} />
                                </button>
                                <button
                                    onClick={() => handleSceneDelete(scene.id)}
                                    className="p-2 bg-white rounded-full text-red-600 hover:text-red-700"
                                    title="Delete Scene"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-medium text-gray-900 dark:text-white">{scene.name}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Order: {scene.orderIndex ?? 0}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Scene Modal */}
            {isSceneModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {currentScene ? 'Edit Scene' : 'New Scene'}
                            </h2>
                            <button onClick={() => setIsSceneModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleSceneSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={sceneFormData.name ?? ''}
                                    onChange={handleSceneInputChange}
                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (VI)</label>
                                    <input
                                        type="text"
                                        name="titleVi"
                                        value={sceneFormData.titleVi ?? ''}
                                        onChange={handleSceneInputChange}
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (EN)</label>
                                    <input
                                        type="text"
                                        name="titleEn"
                                        value={sceneFormData.titleEn ?? ''}
                                        onChange={handleSceneInputChange}
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        checked={uploadType === 'url'}
                                        onChange={() => setUploadType('url')}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">URL</span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        checked={uploadType === 'file'}
                                        onChange={() => setUploadType('file')}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">Upload File</span>
                                </label>
                            </div>

                            {uploadType === 'url' ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Panorama URL *</label>
                                    <input
                                        type="text"
                                        name="panoramaUrl"
                                        value={sceneFormData.panoramaUrl ?? ''}
                                        onChange={handleSceneInputChange}
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        required={uploadType === 'url'}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Panorama Image *</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setPanoramaFile(e.target.files[0])}
                                        accept="image/*"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        required={uploadType === 'file' && !currentScene}
                                    />
                                </div>
                            )}
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Order</label>
                                    <input
                                        type="number"
                                        name="orderIndex"
                                        value={sceneFormData.orderIndex ?? 0}
                                        onChange={handleSceneInputChange}
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yaw</label>
                                    <input
                                        type="number"
                                        name="initialYaw"
                                        value={sceneFormData.initialYaw ?? 0}
                                        onChange={handleSceneInputChange}
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pitch</label>
                                    <input
                                        type="number"
                                        name="initialPitch"
                                        value={sceneFormData.initialPitch ?? 0}
                                        onChange={handleSceneInputChange}
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsSceneModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    {currentScene ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Hotspot Manager Modal */}
            {isHotspotModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center sticky top-0 bg-white dark:bg-slate-800">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                Manage Hotspots - {currentScene?.name}
                            </h2>
                            <button onClick={() => setIsHotspotModalOpen(false)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                                &times;
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            {/* Hotspot Form */}
                            <form onSubmit={handleHotspotSubmit} className="bg-gray-50 dark:bg-slate-700 p-4 rounded-lg space-y-4">
                                <h3 className="font-medium text-gray-900 dark:text-white">
                                    {currentHotspot ? 'Edit Hotspot' : 'Add Hotspot'}
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
                                        <select
                                            name="type"
                                            value={hotspotFormData.type ?? 'link_scene'}
                                            onChange={handleHotspotInputChange}
                                            className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                        >
                                            <option value="link_scene">Link to Scene</option>
                                            <option value="info">Info Popup</option>
                                            <option value="url">External URL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
                                        <input
                                            type="text"
                                            name="icon"
                                            value={hotspotFormData.icon ?? ''}
                                            onChange={handleHotspotInputChange}
                                            className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yaw</label>
                                        <input
                                            type="number"
                                            name="yaw"
                                            value={hotspotFormData.yaw ?? 0}
                                            onChange={handleHotspotInputChange}
                                            className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pitch</label>
                                        <input
                                            type="number"
                                            name="pitch"
                                            value={hotspotFormData.pitch ?? 0}
                                            onChange={handleHotspotInputChange}
                                            className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                        />
                                    </div>
                                </div>
                                {hotspotFormData.type === 'link_scene' && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Target Scene</label>
                                        <select
                                            name="targetSceneId"
                                            value={hotspotFormData.targetSceneId ?? ''}
                                            onChange={handleHotspotInputChange}
                                            className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                            required
                                        >
                                            <option value="">Select a scene</option>
                                            {scenes.filter(s => s.id !== currentScene?.id).map(scene => (
                                                <option key={scene.id} value={scene.id}>{scene.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {(hotspotFormData.type === 'info' || hotspotFormData.type === 'url') && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (VI)</label>
                                                <input
                                                    type="text"
                                                    name="titleVi"
                                                    value={hotspotFormData.titleVi ?? ''}
                                                    onChange={handleHotspotInputChange}
                                                    className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title (EN)</label>
                                                <input
                                                    type="text"
                                                    name="titleEn"
                                                    value={hotspotFormData.titleEn ?? ''}
                                                    onChange={handleHotspotInputChange}
                                                    className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (VI)</label>
                                                <textarea
                                                    name="descriptionVi"
                                                    value={hotspotFormData.descriptionVi ?? ''}
                                                    onChange={handleHotspotInputChange}
                                                    rows="2"
                                                    className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (EN)</label>
                                                <textarea
                                                    name="descriptionEn"
                                                    value={hotspotFormData.descriptionEn ?? ''}
                                                    onChange={handleHotspotInputChange}
                                                    rows="2"
                                                    className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="flex justify-end gap-2">
                                    {currentHotspot && (
                                        <button
                                            type="button"
                                            onClick={() => handleHotspotDelete(currentHotspot.id)}
                                            className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    )}
                                    <button
                                        type="button"
                                        onClick={() => openHotspotForm(null)}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-slate-600 dark:text-gray-300 dark:hover:bg-slate-500"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                    >
                                        {currentHotspot ? 'Update' : 'Add'}
                                    </button>
                                </div>
                            </form>

                            {/* Hotspots List */}
                            <div>
                                <h3 className="font-medium text-gray-900 dark:text-white mb-4">Existing Hotspots</h3>
                                <div className="space-y-2">
                                    {hotspots.map(hotspot => (
                                        <div key={hotspot.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                                            <div>
                                                <div className="font-medium text-gray-900 dark:text-white">
                                                    {hotspot.type === 'link_scene' && `→ ${scenes.find(s => s.id === hotspot.targetSceneId)?.name || 'Unknown'}`}
                                                    {hotspot.type === 'info' && (hotspot.titleVi || hotspot.titleEn || 'Info')}
                                                    {hotspot.type === 'url' && (hotspot.titleVi || hotspot.titleEn || 'Link')}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {hotspot.type} | Yaw: {hotspot.yaw}, Pitch: {hotspot.pitch}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => openHotspotForm(hotspot)}
                                                className="text-blue-600 hover:text-blue-700 dark:text-blue-400"
                                            >
                                                <Edit size={18} />
                                            </button>
                                        </div>
                                    ))}
                                    {hotspots.length === 0 && (
                                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">No hotspots yet</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminScenes;
