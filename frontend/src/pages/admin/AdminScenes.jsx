import React, { useState, useEffect } from 'react';
import * as projectsService from '../../services/projects.service';
import * as scenesService from '../../services/scenes.service';
import * as hotspotsService from '../../services/hotspots.service';
import Viewer360 from "../../components/Viewer360";
import {
    Plus,
    Edit,
    Trash2,
    MapPin,
    Image as ImageIcon,
    ArrowLeft,
} from "lucide-react";



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
    const API_URL = import.meta.env.VITE_API_URL;
    const [isPickerOpen, setIsPickerOpen] = useState(false);


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
        icon: '',

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
            const data = await projectsService.getAll();
            setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchScenes = async (projectId) => {
        try {
            const data = await scenesService.getByProjectId(projectId);
            // Sort by orderIndex to ensure correct display order
            const sortedScenes = data.sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
            setScenes(sortedScenes);
        } catch (error) {
            console.error('Error fetching scenes:', error);
        }
    };

    const handleSceneInputChange = (e) => {
        const { name, value } = e.target;
        setSceneFormData(prev => ({
            ...prev,
            [name]: value ?? ''
        }));
    };

    const openSceneModal = (scene = null) => {
        if (scene) {
            setCurrentScene(scene);

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

        if (!selectedProject || !selectedProject.id) {
            alert('Please select a project first');
            return;
        }

        if (!sceneFormData.name || !sceneFormData.name.trim()) {
            alert('Scene name is required');
            return;
        }

        try {
            let panoramaUrl = sceneFormData.panoramaUrl;

            if (uploadType === 'file' && panoramaFile) {
                const formData = new FormData();
                formData.append('file', panoramaFile);
                const uploadResponse = await scenesService.uploadPanorama(formData);
                panoramaUrl = uploadResponse.fileUrl || uploadResponse;
            }

            if (!panoramaUrl || !panoramaUrl.trim()) {
                alert('Panorama URL or file is required');
                return;
            }

            const sceneData = {
                name: sceneFormData.name,
                titleVi: sceneFormData.titleVi || '',
                titleEn: sceneFormData.titleEn || '',
                panoramaUrl: panoramaUrl,
                orderIndex: parseInt(sceneFormData.orderIndex) || 0,
                initialYaw: parseFloat(sceneFormData.initialYaw) || 0,
                initialPitch: parseFloat(sceneFormData.initialPitch) || 0,
                projectId: selectedProject.id
            };

            console.log('Submitting scene data:', sceneData);

            if (currentScene) {
                await scenesService.update(currentScene.id, sceneData);
            } else {
                await scenesService.create(sceneData);
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
                await scenesService.remove(id);
                fetchScenes(selectedProject.id);
            } catch (error) {
                console.error('Error deleting scene:', error);
                alert('Failed to delete scene');
            }
        }
    };

    const fetchHotspots = async (sceneId) => {
        try {
            const data = await hotspotsService.getBySceneId(sceneId);
            setHotspots(data);
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
            [name]: value ?? ''
        }));
    };

    const openHotspotForm = (hotspot = null) => {
        if (hotspot) {
            setCurrentHotspot(hotspot);

            setHotspotFormData({
                type: hotspot.type ?? "link_scene",
                yaw: hotspot.yaw ?? 0,
                pitch: hotspot.pitch ?? 0,
                targetSceneId: hotspot.targetSceneId ?? "",
                titleVi: hotspot.titleVi ?? "",
                titleEn: hotspot.titleEn ?? "",
                descriptionVi: hotspot.descriptionVi ?? "",
                descriptionEn: hotspot.descriptionEn ?? "",

                icon:
                    hotspot.icon ??
                    (hotspot.type === "info"
                        ? "info"
                        : hotspot.type === "url"
                            ? "link"
                            : "")
            });
        } else {
            setCurrentHotspot(null);
            setHotspotFormData({
                type: "link_scene",
                yaw: 0,
                pitch: 0,
                targetSceneId: "",
                titleVi: "",
                titleEn: "",
                descriptionVi: "",
                descriptionEn: "",

                icon: ""
            });
        }
    };

    const handleTypeChange = (type) => {
        setHotspotFormData(prev => ({
            ...prev,
            type,
            icon:
                type === "info"
                    ? "info"
                    : type === "url"
                        ? "link"
                        : prev.icon
        }));
    };

    const handleHotspotSubmit = async (e) => {
        e.preventDefault();

        try {
            const hotspotData = {
                type: hotspotFormData.type,
                yaw: parseFloat(hotspotFormData.yaw) || 0,
                pitch: parseFloat(hotspotFormData.pitch) || 0,
                targetSceneId: hotspotFormData.targetSceneId
                    ? parseInt(hotspotFormData.targetSceneId)
                    : null,
                titleVi: hotspotFormData.titleVi || '',
                titleEn: hotspotFormData.titleEn || '',
                descriptionVi: hotspotFormData.descriptionVi || '',
                descriptionEn: hotspotFormData.descriptionEn || '',
                icon: hotspotFormData.icon || ''
            };

            let savedHotspot;

            if (currentHotspot) {
                savedHotspot = await hotspotsService.update(
                    currentScene.id,
                    currentHotspot.id,
                    hotspotData
                );

                setHotspots(prev =>
                    prev.map(h =>
                        h.id === currentHotspot.id ? { ...h, ...hotspotData } : h
                    )
                );

            } else {
                savedHotspot = await hotspotsService.createForScene(
                    currentScene.id,
                    hotspotData
                );

                setHotspots(prev => [...prev, savedHotspot]);
            }

            setCurrentScene(prev => ({
                ...prev,
                hotspots: [
                    ...hotspots.filter(h => h.id !== savedHotspot.id),
                    savedHotspot
                ]
            }));

            openHotspotForm(null);

        } catch (error) {
            console.error('Error saving hotspot:', error);
            alert('Failed to save hotspot');
        }
    };

    const handleHotspotDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this hotspot?')) {
            try {
                await hotspotsService.remove(currentScene.id, id);
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
                                    src={
                                        scene.panoramaUrl.startsWith("http")
                                            ? scene.panoramaUrl
                                            : `${API_URL}${scene.panoramaUrl}`
                                    }
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
                                            value={hotspotFormData.type}
                                            onChange={(e) => handleTypeChange(e.target.value)}
                                            className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                        >
                                            <option value="link_scene">Link to Scene</option>
                                            <option value="info">Info Popup</option>
                                            <option value="url">External URL</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Icon
                                        </label>
                                        {hotspotFormData.type === "link_scene" && (
                                            <div className="flex gap-2">
                                                {[
                                                    { key: "arrow_left" },
                                                    { key: "arrow_right" },
                                                    { key: "arrow_up" },
                                                    { key: "arrow_down" },
                                                ].map((icon) => (
                                                    <button
                                                        key={icon.key}
                                                        type="button"
                                                        onClick={() =>
                                                            setHotspotFormData((prev) => ({ ...prev, icon: icon.key }))
                                                        }
                                                        className={`
                                                                w-10 h-10 flex items-center justify-center border rounded transition
                                                                ${hotspotFormData.icon === icon.key
                                                                ? "border-blue-500 bg-blue-500/20"
                                                                : "border-gray-500 bg-slate-700"
                                                            }
            `}
                                                    >
                                                        <img
                                                            src={`/assets/icons/${icon.key}.png`}
                                                            className="w-5 h-5"
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                        {hotspotFormData.type === "info" && (
                                            <div className="flex gap-2">
                                                <div
                                                    className={`
                                                        w-10 h-10 flex items-center justify-center border rounded
                                                        border-blue-500 bg-blue-50 dark:bg-blue-900
                                                    `}
                                                >
                                                    <img src="/assets/icons/info.png" className="w-5 h-5 opacity-90" />
                                                </div>
                                            </div>
                                        )}
                                        {hotspotFormData.type === "url" && (
                                            <div className="flex gap-2">
                                                <div
                                                    className={`
                                                        w-10 h-10 flex items-center justify-center border rounded
                                                        border-blue-500 bg-blue-50 dark:bg-blue-900
                                                    `}
                                                >
                                                    <img src="/assets/icons/link.png" className="w-5 h-5 opacity-90" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Yaw</label>
                                        <input
                                            type="number"
                                            name="yaw"
                                            value={hotspotFormData.yaw}
                                            onChange={handleHotspotInputChange}
                                            className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Pitch</label>
                                        <input
                                            type="number"
                                            name="pitch"
                                            value={hotspotFormData.pitch}
                                            onChange={handleHotspotInputChange}
                                            className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => setIsPickerOpen(true)}
                                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                    >
                                        Chọn trên 360°
                                    </button>
                                </div>
                                {hotspotFormData.type === "url" && (
                                    <input
                                        type="text"
                                        name="descriptionVi"
                                        value={hotspotFormData.descriptionVi ?? ""}
                                        onChange={(e) =>
                                            setHotspotFormData(prev => ({
                                                ...prev,
                                                descriptionVi: e.target.value,
                                                descriptionEn: e.target.value
                                            }))
                                        }
                                        placeholder="https://example.com"
                                        className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                        required
                                    />
                                )}
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

                                {(hotspotFormData.type === 'info') && (
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
                                        {hotspotFormData.type === "info" && (
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Description (VI)
                                                    </label>
                                                    <textarea
                                                        name="descriptionVi"
                                                        value={hotspotFormData.descriptionVi ?? ''}
                                                        onChange={handleHotspotInputChange}
                                                        rows="2"
                                                        className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                        Description (EN)
                                                    </label>
                                                    <textarea
                                                        name="descriptionEn"
                                                        value={hotspotFormData.descriptionEn ?? ''}
                                                        onChange={handleHotspotInputChange}
                                                        rows="2"
                                                        className="w-full p-2 border rounded dark:bg-slate-600 dark:border-slate-500 dark:text-white"
                                                    />
                                                </div>
                                            </div>
                                        )}
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
                                                    {hotspot.type} | Yaw: {hotspot.yaw}, Pitch: {hotspot.pitch} | Icon: {hotspot.icon && (
                                                        <img
                                                            src={`/assets/icons/${hotspot.icon}.png`}
                                                            className="w-5 h-5 inline-block opacity-80"
                                                        />
                                                    )}
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
                            {isPickerOpen && (
                                <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
                                    <div className="bg-white dark:bg-slate-800 w-full max-w-5xl h-[80vh] rounded-lg relative overflow-hidden flex flex-col">

                                        {/* HEADER */}
                                        <div className="flex items-center justify-between px-4 py-2 border-b dark:border-slate-700">
                                            <div className="text-sm text-gray-700 dark:text-gray-300">
                                                Click vào ảnh 360° để lấy vị trí Hotspot.
                                            </div>

                                            <button
                                                onClick={() => setIsPickerOpen(false)}
                                                className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300
                                                             dark:bg-slate-600 dark:hover:bg-slate-500 text-sm"
                                            >
                                                Hủy
                                            </button>
                                        </div>

                                        {/* VIEWER */}
                                        <div className="flex-1">
                                            <Viewer360
                                                scenes={[currentScene]}
                                                initialSceneId={currentScene.id}
                                                onClick={(pitch, yaw) => {
                                                    // console.log('PICKED:', pitch, yaw);
                                                    setHotspotFormData(prev => ({
                                                        ...prev,
                                                        pitch: parseFloat(pitch.toFixed(2)),
                                                        yaw: parseFloat(yaw.toFixed(2)),
                                                    }));
                                                    setIsPickerOpen(false);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminScenes;
