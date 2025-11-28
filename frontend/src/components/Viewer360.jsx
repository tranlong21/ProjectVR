import React, { useEffect, useRef, useState } from 'react';
import 'pannellum/build/pannellum.css';
import 'pannellum';
import { getPanoramaUrl } from '../utils/fileUtils';

const Viewer360 = ({ scenes = [], initialSceneId = null, i18n = { language: 'en' } }) => {
    const viewerContainer = useRef(null);
    const viewerInstance = useRef(null);
    const [currentSceneId, setCurrentSceneId] = useState(initialSceneId || (scenes.length > 0 ? scenes[0].id : null));

    useEffect(() => {
        if (viewerContainer.current && scenes.length > 0 && currentSceneId) {
            const scene = scenes.find(s => s.id === currentSceneId);
            if (!scene) return;

            console.log("Initializing Pannellum with scene:", scene);

            // Destroy previous instance if it exists
            if (viewerInstance.current) {
                try {
                    viewerInstance.current.destroy();
                } catch (e) {
                    console.warn("Error destroying previous viewer instance:", e);
                }
            }

            try {
                // Get the full panorama URL
                const panoramaUrl = getPanoramaUrl(scene.panoramaUrl);
                console.log("Loading panorama from:", panoramaUrl);

                // Convert hotspots to Pannellum format
                const pannellumHotspots = (scene.hotspots || []).map((hotspot) => {
                    const baseHotspot = {
                        pitch: hotspot.pitch || 0,
                        yaw: hotspot.yaw || 0,
                        type: hotspot.type === 'link_scene' ? 'scene' : 'info',
                        text: i18n.language === 'vi' ? (hotspot.titleVi || hotspot.titleEn) : (hotspot.titleEn || hotspot.titleVi),
                    };

                    if (hotspot.type === 'link_scene' && hotspot.targetSceneId) {
                        return {
                            ...baseHotspot,
                            sceneId: hotspot.targetSceneId,
                            clickHandlerFunc: () => {
                                console.log("Switching to scene:", hotspot.targetSceneId);
                                setCurrentSceneId(hotspot.targetSceneId);
                            }
                        };
                    } else if (hotspot.type === 'info') {
                        const description = i18n.language === 'vi' ? (hotspot.descriptionVi || hotspot.descriptionEn) : (hotspot.descriptionEn || hotspot.descriptionVi);
                        return {
                            ...baseHotspot,
                            text: description || baseHotspot.text
                        };
                    } else if (hotspot.type === 'url') {
                        const url = i18n.language === 'vi' ? (hotspot.descriptionVi || hotspot.descriptionEn) : (hotspot.descriptionEn || hotspot.descriptionVi);
                        return {
                            ...baseHotspot,
                            URL: url,
                            type: 'info'
                        };
                    }

                    return baseHotspot;
                });

                // Initialize Pannellum with proper panorama URL
                viewerInstance.current = window.pannellum.viewer(viewerContainer.current, {
                    type: 'equirectangular',
                    panorama: panoramaUrl,
                    pitch: scene.initialPitch || 0,
                    yaw: scene.initialYaw || 0,
                    hfov: 110,
                    autoLoad: true,
                    showControls: true,
                    hotSpots: pannellumHotspots,
                    crossOrigin: 'anonymous', // Enable CORS for images
                    onError: (err) => {
                        console.error("Pannellum Error:", err);
                        console.error("Failed to load panorama:", panoramaUrl);
                    }
                });
            } catch (error) {
                console.error("Failed to initialize Pannellum:", error);
            }
        }

        return () => {
            if (viewerInstance.current) {
                try {
                    viewerInstance.current.destroy();
                    viewerInstance.current = null;
                } catch (e) {
                    // Ignore destroy errors on unmount
                }
            }
        };
    }, [scenes, currentSceneId, i18n.language]);

    // Scene navigation thumbnails
    const renderSceneSelector = () => {
        if (scenes.length <= 1) return null;

        return (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/70 p-2 rounded-full backdrop-blur-sm z-10 overflow-x-auto max-w-[90%]">
                {scenes.map((scene) => (
                    <button
                        key={scene.id}
                        onClick={() => setCurrentSceneId(scene.id)}
                        className={`min-w-[60px] h-16 rounded-lg border-2 overflow-hidden transition-all hover:scale-110 flex-shrink-0 ${currentSceneId === scene.id ? 'border-blue-500 ring-2 ring-blue-400' : 'border-white/50'}`}
                        title={i18n.language === 'vi' ? scene.titleVi : scene.titleEn}
                    >
                        <img
                            src={getPanoramaUrl(scene.panoramaUrl)}
                            alt={scene.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.src = '/assets/images/vr_hero_banner.png';
                            }}
                        />
                    </button>
                ))}
            </div>
        );
    };

    return (
        <div className="relative w-full h-full">
            <div ref={viewerContainer} className="w-full h-full min-h-[400px] bg-gray-900" />
            {renderSceneSelector()}
        </div>
    );
};

export default Viewer360;
