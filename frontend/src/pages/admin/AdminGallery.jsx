import React, { useEffect, useState } from "react";
import * as projectsService from "../../services/projects.service";
import * as galleryService from "../../services/gallery.service";
import {
    Plus,
    Edit,
    Trash2,
    ArrowLeft,
    Image as ImageIcon,
} from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const AdminGallery = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);

    const [items, setItems] = useState([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState(null);

    const [formData, setFormData] = useState({
        caption: "",
        url: "",
    });

    const [uploadType, setUploadType] = useState("url"); // 'url' | 'file'
    const [file, setFile] = useState(null);

    const [loadingProjects, setLoadingProjects] = useState(true);
    const [loadingGallery, setLoadingGallery] = useState(false);

    // ---------- LOAD PROJECTS ----------
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const data = await projectsService.getAll();
                setProjects(data);
            } catch (err) {
                console.error("Error loading projects:", err);
            } finally {
                setLoadingProjects(false);
            }
        };
        fetchProjects();
    }, []);

    // ---------- LOAD GALLERY WHEN PROJECT SELECTED ----------
    useEffect(() => {
        if (!selectedProject) {
            setItems([]);
            return;
        }

        const fetchGallery = async () => {
            try {
                setLoadingGallery(true);
                const data = await galleryService.getByProjectId(selectedProject.id);
                setItems(data);
            } catch (err) {
                console.error("Error loading gallery:", err);
            } finally {
                setLoadingGallery(false);
            }
        };

        fetchGallery();
    }, [selectedProject]);

    // ---------- HELPERS ----------
    const resolveImageUrl = (url) => {
        if (!url) return "";
        if (url.startsWith("http")) return url;
        return `${API_BASE_URL}${url}`;
    };

    // ---------- MODAL OPEN/CLOSE ----------
    const openModal = (item = null) => {
        if (item) {
            setCurrentItem(item);
            setFormData({
                caption: item.caption ?? "",
                url: item.url ?? "",
            });
        } else {
            setCurrentItem(null);
            setFormData({
                caption: "",
                url: "",
            });
        }
        setUploadType("url");
        setFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentItem(null);
        setFile(null);
    };

    // ---------- SUBMIT ----------
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedProject || !selectedProject.id) {
            alert("Please select a project first");
            return;
        }

        if (!formData.caption || !formData.caption.trim()) {
            alert("Caption is required");
            return;
        }

        try {
            let finalUrl = formData.url;

            // Nếu chọn upload file
            if (uploadType === "file") {
                if (!file) {
                    alert("Please choose an image file");
                    return;
                }
                const uploadForm = new FormData();
                uploadForm.append("file", file);
                const uploadRes = await galleryService.uploadImage(uploadForm);
                finalUrl = uploadRes.fileUrl || uploadRes;
            }

            if (!finalUrl || !finalUrl.trim()) {
                alert("Image URL or file is required");
                return;
            }

            const payload = {
                caption: formData.caption,
                url: finalUrl,
                projectId: selectedProject.id,
            };

            if (currentItem) {
                await galleryService.update(currentItem.id, payload);
            } else {
                await galleryService.create(payload);
            }

            // Reload gallery
            const refreshed = await galleryService.getByProjectId(
                selectedProject.id
            );
            setItems(refreshed);

            closeModal();
        } catch (err) {
            console.error("Error saving gallery item:", err);
            const msg =
                err.response?.data?.message || err.response?.data || err.message;
            alert("Failed to save gallery item: " + msg);
        }
    };

    // ---------- DELETE ----------
    const handleDelete = async (id) => {
        if (!selectedProject) return;

        if (!window.confirm("Are you sure you want to delete this image?")) {
            return;
        }

        try {
            await galleryService.remove(id);
            const refreshed = await galleryService.getByProjectId(
                selectedProject.id
            );
            setItems(refreshed);
        } catch (err) {
            console.error("Error deleting gallery item:", err);
            alert("Failed to delete item");
        }
    };

    // =====================================================================
    // RENDER
    // =====================================================================
    if (!selectedProject) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Gallery Management
                </h1>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">
                        Select a Project
                    </h2>

                    {loadingProjects && (
                        <p className="text-gray-500 dark:text-gray-400">
                            Loading projects...
                        </p>
                    )}

                    {!loadingProjects && projects.length === 0 && (
                        <p className="text-gray-500 dark:text-gray-400">
                            No projects found.
                        </p>
                    )}

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
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // When project is selected
    return (
        <div className="space-y-6">
            {/* Header */}
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
                        Manage Gallery Images
                    </p>
                </div>

                <button
                    onClick={() => openModal(null)}
                    className="ml-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg inline-flex items-center gap-2"
                >
                    <Plus size={20} />
                    Add Image
                </button>
            </div>

            {/* Gallery Grid */}
            <div>
                {loadingGallery && (
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        Loading gallery...
                    </p>
                )}

                {!loadingGallery && items.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 mb-4">
                        No images in this gallery yet.
                    </p>
                )}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {items.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white dark:bg-slate-800 rounded-lg shadow overflow-hidden group relative"
                        >
                            {/* Thumbnail */}
                            <div className="relative h-40 bg-gray-200 dark:bg-slate-700">
                                {item.url ? (
                                    <img
                                        src={resolveImageUrl(item.url)}
                                        alt={item.caption || "Gallery image"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.src = "/assets/images/vr_hero_banner.png";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <ImageIcon size={48} className="text-gray-400" />
                                    </div>
                                )}

                                {/* Hover overlay */}
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 gap-2">
                                    <button
                                        onClick={() => openModal(item)}
                                        className="p-2 bg-white rounded-full text-blue-600 hover:text-blue-700"
                                        title="Edit Image"
                                    >
                                        <Edit size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="p-2 bg-white rounded-full text-red-600 hover:text-red-700"
                                        title="Delete Image"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Caption */}
                            <div className="p-3">
                                <div className="font-medium text-sm text-gray-900 dark:text-white truncate">
                                    {item.caption || "(No caption)"}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal Add/Edit */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white dark:bg-slate-800 rounded-lg w-full max-w-md">
                        <div className="p-6 border-b border-gray-200 dark:border-slate-700 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                {currentItem ? "Edit Gallery Image" : "New Gallery Image"}
                            </h2>
                            <button
                                onClick={closeModal}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            >
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Caption */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Caption *
                                </label>
                                <input
                                    type="text"
                                    value={formData.caption ?? ""}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            caption: e.target.value,
                                        }))
                                    }
                                    className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                    required
                                />
                            </div>

                            {/* Upload type */}
                            <div className="flex gap-4 mb-2">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="uploadType"
                                        value="url"
                                        checked={uploadType === "url"}
                                        onChange={(e) => setUploadType(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Image URL
                                    </span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        name="uploadType"
                                        value="file"
                                        checked={uploadType === "file"}
                                        onChange={(e) => setUploadType(e.target.value)}
                                        className="mr-2"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">
                                        Upload File
                                    </span>
                                </label>
                            </div>

                            {/* URL or File input */}
                            {uploadType === "url" ? (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Image URL *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.url ?? ""}
                                        onChange={(e) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                url: e.target.value,
                                            }))
                                        }
                                        className="w-full p-2 border rounded dark:bg-slate-700 dark:border-slate-600 dark:text-white"
                                        placeholder="https://example.com/image.jpg"
                                        required={uploadType === "url"}
                                    />
                                </div>
                            ) : (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Image File *
                                    </label>
                                    <input
                                        key={uploadType} 
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFile(e.target.files[0] || null)}
                                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                        required={uploadType === "file" && !currentItem}
                                    />
                                    {currentItem && currentItem.url && (
                                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            Leave empty to keep current image.
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Preview (optional) */}
                            {(formData.url && uploadType === "url") ||
                                (file && uploadType === "file") ? (
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">
                                        Preview:
                                    </p>
                                    <div className="border rounded-md p-2 bg-gray-50 dark:bg-slate-700 flex justify-center">
                                        <img
                                            src={
                                                uploadType === "url"
                                                    ? resolveImageUrl(formData.url)
                                                    : file
                                                        ? URL.createObjectURL(file)
                                                        : ""
                                            }
                                            alt="preview"
                                            className="max-h-40 object-contain"
                                        />
                                    </div>
                                </div>
                            ) : null}

                            {/* Actions */}
                            <div className="flex justify-end gap-4 pt-4">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-300 dark:hover:bg-slate-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                                >
                                    {currentItem ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGallery;
