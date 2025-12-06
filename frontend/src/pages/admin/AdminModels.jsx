// src/pages/admin/AdminModels.jsx
import React, { useState, useEffect } from "react";
import * as projectsService from "../../services/projects.service";
import * as modelsService from "../../services/models3d.service";
import { Upload, Trash2, Box, ArrowLeft, ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

import Viewer3D from "../../components/Viewer3D";
import * as hotspotService from "../../services/hotspots.service";

const AdminModels = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    const [models, setModels] = useState([]);
    const [loading, setLoading] = useState(true);

    const { t } = useTranslation();

    // Upload model
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFormData, setUploadFormData] = useState({
        name: "",
        descriptionVi: "",
        descriptionEn: "",
        modelUrl: "",
    });
    const [modelFile, setModelFile] = useState(null);
    const [uploadType, setUploadType] = useState("file"); // file | url

    // Hotspots
    const [hotspots, setHotspots] = useState([]);
    const [isHotspotModalOpen, setIsHotspotModalOpen] = useState(false);
    const [selectedModel, setSelectedModel] = useState(null);
    const [editMode, setEditMode] = useState(false); // bật/tắt chế độ chọn hotspot
    const [pendingHotspot, setPendingHotspot] = useState(null); // vị trí click gần nhất

    // =========================
    // EFFECT: LOAD PROJECTS
    // =========================
    useEffect(() => {
        fetchProjects();
    }, []);

    // Khi đổi project → load models
    useEffect(() => {
        if (selectedProject) {
            fetchModels(selectedProject.id);
        } else {
            setModels([]);
        }
    }, [selectedProject]);

    // =========================
    // API CALLS
    // =========================
    const fetchProjects = async () => {
        try {
            const data = await projectsService.getAll();
            setProjects(data || []);
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchModels = async (projectId) => {
        try {
            const data = await modelsService.getByProjectId(projectId);
            setModels(data || []);
        } catch (error) {
            console.error("Error fetching models:", error);
        }
    };

    const fetchHotspots = async (modelId) => {
        try {
            const data = await hotspotService.getByModelId(modelId);
            setHotspots(data || []);
        } catch (err) {
            console.error("Error loading hotspots:", err);
        }
    };

    // =========================
    // HANDLERS: UPLOAD MODEL
    // =========================
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUploadFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setModelFile(e.target.files[0]);
        }
    };

    const handleUploadSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProject) {
            alert("Please select a project first.");
            return;
        }

        try {
            const formData = new FormData();

            // Required
            formData.append("name", uploadFormData.name);

            // New fields
            formData.append("descriptionVi", uploadFormData.descriptionVi || "");
            formData.append("descriptionEn", uploadFormData.descriptionEn || "");

            // Upload type
            if (uploadType === "file" && modelFile) {
                formData.append("file", modelFile);
            } else if (uploadType === "url" && uploadFormData.modelUrl) {
                formData.append("modelUrl", uploadFormData.modelUrl);
            } else {
                alert("Please select a file or enter a URL");
                return;
            }

            await modelsService.uploadModel(selectedProject.id, formData);

            // Reset UI
            setIsUploadModalOpen(false);
            setUploadFormData({
                name: "",
                descriptionVi: "",
                descriptionEn: "",
                modelUrl: "",
            });
            setModelFile(null);

            fetchModels(selectedProject.id);
        } catch (error) {
            console.error("Error uploading model:", error);
            alert("Failed to upload model: " + (error.response?.data || error.message));
        }
    };

    const handleDeleteModel = async (id) => {
        if (!selectedProject) return;
        if (!window.confirm("Are you sure you want to delete this model?")) return;

        try {
            await modelsService.deleteModelAdmin(id);
            fetchModels(selectedProject.id);
        } catch (error) {
            console.error("Error deleting model:", error);
            alert("Failed to delete model");
        }
    };

    // =========================
    // RENDER: NO PROJECT SELECTED
    // =========================
    if (!selectedProject) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    3D Models Management
                </h1>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    {loading ? (
                        <div className="text-gray-500 dark:text-gray-400">
                            Loading projects...
                        </div>
                    ) : (
                        <>
                            <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                                Select a Project
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {projects.map((project) => (
                                    <div
                                        key={project.id}
                                        onClick={() => setSelectedProject(project)}
                                        className="border border-gray-200 dark:border-slate-700 rounded-lg p-4 cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
                                    >
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {project.title}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {project.has3d ? "Has 3D Model" : "No 3D Model"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // =========================
    // MAIN RENDER
    // =========================
    const currentModel = models[0] || null;

    return (
        <div className="space-y-6 relative">
            {/* HEADER */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setSelectedProject(null)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300"
                >
                    <ArrowLeft size={24} />
                </button>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedProject.title}
                    </h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Manage 3D Model
                    </p>
                </div>
            </div>

            {/* NO MODEL */}
            {!currentModel ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-12 text-center">
                    <Box size={48} className="mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        No 3D Model Found
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">
                        This project doesn't have a 3D model yet.
                    </p>
                    <button
                        onClick={() => {
                            setUploadFormData({
                                name: "",
                                descriptionVi: "",
                                descriptionEn: "",
                                modelUrl: "",
                            });
                            setUploadType("file");
                            setIsUploadModalOpen(true);
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg inline-flex items-center gap-2"
                    >
                        <Upload size={20} />
                        Upload Model
                    </button>
                </div>
            ) : (
                // MODEL INFO
                <div className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden">
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {currentModel.name}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    Format: {currentModel.format}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                {/* REPLACE MODEL */}
                                <button
                                    onClick={() => {
                                        const m = currentModel;
                                        setUploadFormData({
                                            name: m?.name || "",
                                            descriptionVi: m?.descriptionVi || "",
                                            descriptionEn: m?.descriptionEn || "",
                                            modelUrl: m?.modelUrl || "",
                                        });
                                        setUploadType(m?.fileUrl ? "file" : "url");
                                        setIsUploadModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                                >
                                    {t("model.replace")}
                                </button>

                                {/* MANAGE HOTSPOTS */}
                                <button
                                    onClick={() => {
                                        setSelectedModel(currentModel);
                                        setEditMode(false);
                                        setPendingHotspot(null);
                                        fetchHotspots(currentModel.id);
                                        setIsHotspotModalOpen(true);
                                    }}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
                                >
                                    Thêm Hotspots
                                </button>

                                {/* DELETE MODEL */}
                                <button
                                    onClick={() => handleDeleteModel(currentModel.id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm flex items-center gap-1"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        </div>

                        {/* MODEL INFO BLOCK */}
                        <div className="bg-gray-100 dark:bg-slate-900 rounded-lg p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    File URL:
                                </span>
                                {currentModel.fileUrl ? (
                                    <a
                                        href={currentModel.fileUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline flex items-center gap-1 text-sm break-all"
                                    >
                                        {currentModel.fileUrl}
                                        <ExternalLink size={14} />
                                    </a>
                                ) : (
                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                        (no fileUrl)
                                    </span>
                                )}
                            </div>

                            {currentModel.description && (
                                <div className="mt-4">
                                    <span className="font-medium text-gray-700 dark:text-gray-300 block mb-1">
                                        Description:
                                    </span>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                                        {currentModel.description}
                                    </p>
                                </div>
                            )}
                        </div>
                        {/*HOTSPOTS LIST BELOW MODEL */}
                        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 mt-4">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                                Hotspots in Model
                            </h3>

                            {hotspots.length === 0 ? (
                                <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    No hotspots yet. Click "Manage Hotspots" to create one.
                                </p>
                            ) : (
                                <ul className="space-y-3">
                                    {hotspots.map(h => (
                                        <li
                                            key={h.id}
                                            className="p-4 bg-slate-900 border border-slate-700 rounded"
                                        >
                                            {/* TITLE */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-white font-medium text-base">
                                                        {h.titleVi || "(no title)"}
                                                    </p>
                                                    <p className="text-xs text-slate-400">
                                                        Order: {h.orderId}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        if (window.confirm("Delete this hotspot?")) {
                                                            hotspotService
                                                                .removeForModel(currentModel.id, h.id)
                                                                .then(() => fetchHotspots(currentModel.id));
                                                        }
                                                    }}
                                                    className="text-red-400 hover:text-red-200 px-2 py-1 rounded text-sm"
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                            {/* POSITION */}
                                            <div className="mt-3">
                                                <p className="text-xs text-slate-400 mb-1 font-semibold">Position (x, y, z)</p>
                                                <p className="text-sm text-slate-200">
                                                    {h.x?.toFixed(3)}, {h.y?.toFixed(3)}, {h.z?.toFixed(3)}
                                                </p>
                                            </div>

                                            {/* CAMERA POSITION */}
                                            <div className="mt-3">
                                                <p className="text-xs text-slate-400 mb-1 font-semibold">Camera Position</p>
                                                <p className="text-sm text-slate-200">
                                                    {h.cameraPosX?.toFixed(3)}, {h.cameraPosY?.toFixed(3)}, {h.cameraPosZ?.toFixed(3)}
                                                </p>
                                            </div>

                                            {/* CAMERA TARGET */}
                                            <div className="mt-3">
                                                <p className="text-xs text-slate-400 mb-1 font-semibold">Camera Target</p>
                                                <p className="text-sm text-slate-200">
                                                    {h.cameraTargetX?.toFixed(3)}, {h.cameraTargetY?.toFixed(3)}, {h.cameraTargetZ?.toFixed(3)}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* UPLOAD / REPLACE MODAL*/}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {models.length > 0 ? "Replace 3D Model" : "Upload 3D Model"}
                            </h2>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Model Name
                                </label>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description (VI)
                                </label>
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
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description (EN)
                                </label>
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
                                        checked={uploadType === "file"}
                                        onChange={() => setUploadType("file")}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Upload File
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        checked={uploadType === "url"}
                                        onChange={() => setUploadType("url")}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        External URL
                                    </span>
                                </label>
                            </div>

                            {/* Upload File or URL */}
                            {uploadType === "file" ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        File (.glb, .gltf)
                                    </label>
                                    <input
                                        type="file"
                                        onChange={handleFileChange}
                                        accept=".glb,.gltf"
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        required={uploadType === "file"}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Model URL
                                    </label>
                                    <input
                                        type="text"
                                        name="modelUrl"
                                        value={uploadFormData.modelUrl}
                                        onChange={handleInputChange}
                                        placeholder="https://raw.githubusercontent.com/.../model.glb"
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        required={uploadType === "url"}
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
                                    {models.length > 0 ? "Replace" : "Upload"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/*HOTSPOT MODAL */}
            {isHotspotModalOpen && selectedModel && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-[#0f172a] text-white rounded-lg w-[90vw] h-[90vh] p-4 relative flex flex-col overflow-hidden">

                        {/* HEADER */}
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-xl font-bold">Hotspot Editor — {selectedModel.name}</h2>

                            <div className="flex gap-2">
                                <button
                                    onClick={() => {
                                        setEditMode(!editMode);
                                        setPendingHotspot(null);
                                    }}
                                    className={`px-4 py-1.5 rounded text-sm 
                            ${editMode ? "bg-yellow-600" : "bg-blue-600"}`}
                                >
                                    {editMode ? "Đang Chọn..." : "Chọn Vị trí"}
                                </button>

                                {pendingHotspot && (
                                    <button
                                        onClick={() => {
                                            hotspotService
                                                .createForModel(selectedModel.id, pendingHotspot)
                                                .then(() => {
                                                    fetchHotspots(selectedModel.id);
                                                    setPendingHotspot(null);
                                                    setEditMode(false);
                                                    alert("Hotspot saved!");
                                                });
                                        }}
                                        className="px-4 py-1.5 bg-green-600 text-sm rounded"
                                    >
                                        Lưu
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        setEditMode(false);
                                        setPendingHotspot(null);
                                        setIsHotspotModalOpen(false);
                                    }}
                                    className="px-4 py-1.5 bg-red-600 text-sm rounded"
                                >
                                    Đóng
                                </button>
                            </div>
                        </div>

                        {/* BODY */}
                        <div className="flex flex-row flex-1 gap-4 overflow-hidden">

                            {/* LEFT: 3D Viewer */}
                            <div className="flex-1 min-w-0 h-full border border-gray-700 rounded">
                                <Viewer3D
                                    modelUrl={selectedModel.fileUrl || selectedModel.modelUrl}
                                    editMode={editMode}
                                    hotspots={hotspots}
                                    onAddHotspot={(pos, camPos, camTarget) => {
                                        if (!editMode) return;

                                        setPendingHotspot({
                                            modelId: selectedModel.id,

                                            x: pos.x,
                                            y: pos.y,
                                            z: pos.z,

                                            cameraPosX: camPos.x,
                                            cameraPosY: camPos.y,
                                            cameraPosZ: camPos.z,

                                            cameraTargetX: camTarget.x,
                                            cameraTargetY: camTarget.y,
                                            cameraTargetZ: camTarget.z,

                                            titleVi: "",
                                            titleEn: "",
                                            orderId: 1,
                                        });
                                    }}
                                    onClickHotspot={(h) => {
                                        if (window.confirm("Delete this hotspot?")) {
                                            hotspotService
                                                .removeForModel(selectedModel.id, h.id)
                                                .then(() => fetchHotspots(selectedModel.id));
                                        }
                                    }}
                                />
                            </div>

                            {/* RIGHT: FORM PANEL */}
                            <div className="w-[300px] bg-slate-800 border border-slate-600 rounded p-3 overflow-y-auto">
                                <h3 className="font-semibold mb-2">Hotspot Details</h3>

                                {!pendingHotspot ? (
                                    <p className="text-sm text-gray-400">
                                        Click "Add Hotspot" → Click vào model để chọn vị trí.
                                    </p>
                                ) : (
                                    <div className="space-y-3">

                                        {/* TITLE VI */}
                                        <div>
                                            <label className="text-xs text-gray-400">Tên điểm (VI)</label>
                                            <input
                                                type="text"
                                                value={pendingHotspot.titleVi || ""}
                                                onChange={e =>
                                                    setPendingHotspot({ ...pendingHotspot, titleVi: e.target.value })
                                                }
                                                className="w-full mt-1 p-2 rounded bg-slate-700"
                                            />
                                        </div>

                                        {/* TITLE EN */}
                                        <div>
                                            <label className="text-xs text-gray-400">Tên điểm (EN)</label>
                                            <input
                                                type="text"
                                                value={pendingHotspot.titleEn || ""}
                                                onChange={e =>
                                                    setPendingHotspot({ ...pendingHotspot, titleEn: e.target.value })
                                                }
                                                className="w-full mt-1 p-2 rounded bg-slate-700"
                                            />
                                        </div>

                                        {/* ORDER ID */}
                                        <div>
                                            <label className="text-xs text-gray-400">Thứ tự hiển thị</label>
                                            <input
                                                type="number"
                                                value={pendingHotspot.orderId ?? 1}
                                                onChange={e =>
                                                    setPendingHotspot({ ...pendingHotspot, orderId: +e.target.value })
                                                }
                                                className="w-full mt-1 p-2 rounded bg-slate-700"
                                            />
                                        </div>

                                        {/* POSITION */}
                                        <div>
                                            <label className="text-xs text-gray-400">Position (x, y, z)</label>

                                            <input type="number" step="0.01" value={pendingHotspot.x}
                                                onChange={e => setPendingHotspot({ ...pendingHotspot, x: +e.target.value })}
                                                className="w-full mt-1 p-2 rounded bg-slate-700" />

                                            <input type="number" step="0.01" value={pendingHotspot.y}
                                                onChange={e => setPendingHotspot({ ...pendingHotspot, y: +e.target.value })}
                                                className="w-full mt-1 p-2 rounded bg-slate-700" />

                                            <input type="number" step="0.01" value={pendingHotspot.z}
                                                onChange={e => setPendingHotspot({ ...pendingHotspot, z: +e.target.value })}
                                                className="w-full mt-1 p-2 rounded bg-slate-700" />
                                        </div>

                                        {/* CAMERA POSITION */}
                                        <div>
                                            <label className="text-xs text-gray-400">Camera Position</label>

                                            <input type="number" step="0.01" value={pendingHotspot.cameraPosX}
                                                onChange={e => setPendingHotspot({ ...pendingHotspot, cameraPosX: +e.target.value })}
                                                className="w-full mt-1 p-2 rounded bg-slate-700" />

                                            <input type="number" step="0.01" value={pendingHotspot.cameraPosY}
                                                onChange={e => setPendingHotspot({ ...pendingHotspot, cameraPosY: +e.target.value })}
                                                className="w-full mt-1 p-2 rounded bg-slate-700" />

                                            <input type="number" step="0.01" value={pendingHotspot.cameraPosZ}
                                                onChange={e => setPendingHotspot({ ...pendingHotspot, cameraPosZ: +e.target.value })}
                                                className="w-full mt-1 p-2 rounded bg-slate-700" />
                                        </div>

                                        {/* CAMERA TARGET */}
                                        <div>
                                            <label className="text-xs text-gray-400">Camera Target</label>

                                            <input type="number" step="0.01" value={pendingHotspot.cameraTargetX}
                                                onChange={e => setPendingHotspot({ ...pendingHotspot, cameraTargetX: +e.target.value })}
                                                className="w-full mt-1 p-2 rounded bg-slate-700" />

                                            <input type="number" step="0.01" value={pendingHotspot.cameraTargetY}
                                                onChange={e => setPendingHotspot({ ...pendingHotspot, cameraTargetY: +e.target.value })}
                                                className="w-full mt-1 p-2 rounded bg-slate-700" />

                                            <input type="number" step="0.01" value={pendingHotspot.cameraTargetZ}
                                                onChange={e => setPendingHotspot({ ...pendingHotspot, cameraTargetZ: +e.target.value })}
                                                className="w-full mt-1 p-2 rounded bg-slate-700" />
                                        </div>

                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminModels;
