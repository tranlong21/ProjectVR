import React, { useState, useEffect } from 'react';
import * as blogImagesService from '../../services/blogImages.service';
import { Upload, X, Trash2, Check, ImageIcon } from 'lucide-react';
import Modal from './Modal';

const ImageSelector = ({ isOpen, onClose, onSelect, usageType = "CONTENT" }) => {
    const [images, setImages] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchImages();
        }
    }, [isOpen]);

    const fetchImages = async () => {
        setLoading(true);
        try {
            const data = await blogImagesService.getAll();
            setImages(data || []);
        } catch (error) {
            console.error("Error fetching images", error);
            // Don't show alert loop, just log
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            await blogImagesService.upload(file, usageType);
            fetchImages();
        } catch (error) {
            alert("Upload failed: " + (error.response?.data || error.message));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        if (window.confirm("Delete this image?")) {
            try {
                await blogImagesService.remove(id);
                setImages(images.filter(img => img.id !== id));
            } catch (error) {
                console.error("Delete failed", error);
                alert("Delete failed");
            }
        }
    };

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={usageType === 'THUMBNAIL' ? "Select Featured Image" : "Media Library"} size="xl">
            <div className="flex flex-col h-[60vh]">
                <div className="flex justify-between items-center mb-4">
                    <label className={`cursor-pointer bg-[#9b4dff] text-white px-4 py-2 rounded hover:bg-[#8a3ee6] flex items-center gap-2 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                        <Upload size={18} />
                        <span>{uploading ? 'Uploading...' : 'Upload New'}</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
                    </label>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900 p-2 rounded border border-gray-200 dark:border-slate-700">
                    {loading ? (
                        <div className="flex justify-center items-center h-full text-gray-500">Loading library...</div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {images.map(img => (
                                <div
                                    key={img.id}
                                    onClick={() => { onSelect(img); onClose(); }}
                                    className="group relative cursor-pointer border-2 border-transparent hover:border-[#9b4dff] rounded-lg overflow-hidden transition-all aspect-square bg-gray-100 dark:bg-slate-800"
                                >
                                    <img
                                        src={`${import.meta.env.VITE_API_URL}${img.url}`}
                                        alt={img.altText}
                                        className="w-full h-full object-cover"
                                        onError={(e) => e.target.src = '/placeholder.png'}
                                    />
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={(e) => handleDelete(e, img.id)}
                                            className="bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-md"
                                            title="Delete Image"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 truncate px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        {img.usageType && <span className="mr-1 text-xs font-bold text-yellow-400">[{img.usageType[0]}]</span>}
                                        {img.altText}
                                    </div>
                                </div>
                            ))}
                            {images.length === 0 && (
                                <div className="col-span-full flex flex-col items-center justify-center text-gray-500 mt-10">
                                    <ImageIcon size={48} className="mb-2 opacity-20" />
                                    <p>No images found. Upload one!</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default ImageSelector;
