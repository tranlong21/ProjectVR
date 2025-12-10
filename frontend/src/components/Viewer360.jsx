import React, { useEffect, useRef, useState } from 'react';
import 'pannellum/build/pannellum.css';
import 'pannellum';
import { getPanoramaUrl } from '../utils/fileUtils';

const Viewer360 = ({ scenes = [], initialSceneId = null, i18n = { language: 'vi' }, onClick, onSceneChange }) => {

    const viewerContainer = useRef(null);
    const viewerInstance = useRef(null);

    const isDragging = useRef(false);
    const mouseDownPos = useRef(null);
    const lastDragTime = useRef(0);
    const isMouseDown = useRef(false);
    const mouseHandlers = useRef(null);
    const mouseEventsAttached = useRef(false);

    const [currentSceneId, setCurrentSceneId] = useState(
        initialSceneId || (scenes.length ? scenes[0].id : null)
    );

    const getIconFile = (hotspot) => {
        if (hotspot.type === "link_scene") return `/assets/icons/${hotspot.icon || "arrow_right"}.png`;
        if (hotspot.type === "info") return "/assets/icons/info.png";
        if (hotspot.type === "url") return "/assets/icons/link.png";
        return null;
    };

    const getURLTitle = (hotspot) => {
        return i18n.language === "vi"
            ? hotspot.titleVi || hotspot.descriptionVi || "Liên kết ngoài"
            : hotspot.titleEn || hotspot.descriptionEn || "External link";
    };

    const buildHotspots = (scene) => {
        return (scene.hotspots || []).map((hotspot) => ({
            pitch: hotspot.pitch,
            yaw: hotspot.yaw,
            type: hotspot.type === "info" ? "info" : "custom",

            text:
                hotspot.type === "info"
                    ? (i18n.language === 'vi'
                        ? hotspot.titleVi || hotspot.descriptionVi
                        : hotspot.titleEn || hotspot.descriptionEn)
                    : undefined,

            createTooltipFunc:
                hotspot.type !== "info"
                    ? (div) => {
                        div.classList.add("custom-hotspot");

                        const iconPath = getIconFile(hotspot);

                        div.innerHTML = `
                            <img src="${iconPath}" class="hotspot-icon" />
                            <div class="hotspot-tooltip"></div>
                        `;

                        const tooltip = div.querySelector(".hotspot-tooltip");

                        if (hotspot.type === "link_scene") {
                            const target = scenes.find(s => s.id === hotspot.targetSceneId);
                            tooltip.innerText = target?.name || "Go to scene";
                        }

                        if (hotspot.type === "url") {
                            tooltip.innerText = getURLTitle(hotspot);
                        }
                    }
                    : null,

            clickHandlerFunc: () => {
                if (hotspot.type === "link_scene") {
                    setCurrentSceneId(hotspot.targetSceneId);
                    if (onSceneChange) onSceneChange(hotspot.targetSceneId);
                }

                if (hotspot.type === "url") {
                    const url =
                        i18n.language === "vi"
                            ? hotspot.descriptionVi
                            : hotspot.descriptionEn;
                    if (url) window.open(url, "_blank");
                }
            }
        }));
    };

    const loadScene = (scene) => {
        if (!viewerContainer.current) return;

        const panoramaUrl = getPanoramaUrl(scene.panoramaUrl);

        try { viewerInstance.current?.destroy(); } catch { }

        viewerInstance.current = window.pannellum.viewer(viewerContainer.current, {
            type: "equirectangular",
            panorama: panoramaUrl,
            autoLoad: true,
            showControls: true,
            pitch: scene.initialPitch || 0,
            yaw: scene.initialYaw || 0,
            hfov: 110,
            hotSpots: []
        });

        const hotspots = buildHotspots(scene);
        hotspots.forEach(h => {
            try { viewerInstance.current.addHotSpot(h); } catch { }
        });

        viewerInstance.current.on("load", () => {
            setupMouseEvents();
        });
    };

    const setupMouseEvents = () => {
        const viewer = viewerInstance.current;
        const container = viewerContainer.current;
        if (!viewer || !container) return;

        // Không gắn thêm lần 2
        if (mouseEventsAttached.current && mouseHandlers.current) return;

        const handleMouseDown = (event) => {
            isMouseDown.current = true;
            isDragging.current = false;
            mouseDownPos.current = { x: event.clientX, y: event.clientY };
        };

        const handleMouseMove = (event) => {
            if (!isMouseDown.current || !mouseDownPos.current) return;

            const dx = Math.abs(event.clientX - mouseDownPos.current.x);
            const dy = Math.abs(event.clientY - mouseDownPos.current.y);

            // Vượt quá 5px coi như drag
            if (dx > 5 || dy > 5) {
                isDragging.current = true;
            }
        };

        const handleMouseUp = (event) => {
            if (!isMouseDown.current) return;

            const wasDragging = isDragging.current;

            isMouseDown.current = false;
            isDragging.current = false;
            mouseDownPos.current = null;

            // Nếu vừa drag thì KHÔNG xử lý click
            if (wasDragging || event.button !== 0) return;

            // Đây mới là click thật → convert sang pitch / yaw
            if (onClick && viewerInstance.current) {
                const [pitch, yaw] = viewerInstance.current.mouseEventToCoords(event);
                onClick(pitch, yaw);
            }
        };

        // Bắt mousedown trên canvas của pannellum
        container.addEventListener("mousedown", handleMouseDown);

        // Bắt move / up toàn cục để không bị hụt event khi kéo nhanh ra ngoài
        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", handleMouseUp);

        mouseHandlers.current = { handleMouseDown, handleMouseMove, handleMouseUp };
        mouseEventsAttached.current = true;
    };


    useEffect(() => {
        if (!viewerContainer.current || !scenes.length || !currentSceneId) return;

        const scene = scenes.find((s) => s.id === currentSceneId);
        if (!scene) return;

        const panoUrl = getPanoramaUrl(scene.panoramaUrl);

        viewerInstance.current = window.pannellum.viewer(viewerContainer.current, {
            type: "equirectangular",
            panorama: panoUrl,
            autoLoad: true,
            showControls: true,
            pitch: scene.initialPitch || 0,
            yaw: scene.initialYaw || 0,
            hfov: 110,
            hotSpots: []
        });

        const hotspots = buildHotspots(scene);
        hotspots.forEach((h) => {
            try {
                viewerInstance.current.addHotSpot(h);
            } catch { }
        });

        viewerInstance.current.on("load", () => {
            setupMouseEvents();
        });

        return () => {
            // Gỡ event chuột
            if (mouseHandlers.current && viewerContainer.current) {
                const { handleMouseDown, handleMouseMove, handleMouseUp } = mouseHandlers.current;

                viewerContainer.current.removeEventListener("mousedown", handleMouseDown);
                window.removeEventListener("mousemove", handleMouseMove);
                window.removeEventListener("mouseup", handleMouseUp);
            }

            mouseEventsAttached.current = false;
            mouseHandlers.current = null;

            viewerInstance.current?.destroy();
        };
    }, []);

    useEffect(() => {
        if (!viewerInstance.current) return;
        if (!scenes.length) return;

        const scene = scenes.find(s => s.id === currentSceneId);
        if (!scene) return;

        loadScene(scene);
    }, [currentSceneId, scenes, i18n.language]);


    const renderSceneSelector = () => {
        if (scenes.length <= 1) return null;

        return (
            <div className="
                absolute bottom-4 left-1/2 transform -translate-x-1/2 
                flex space-x-2 bg-black/70 p-2 rounded-full 
                backdrop-blur-sm z-10 max-w-[90%] overflow-x-auto no-scrollbar
            ">
                {scenes.map(scene => (
                    <button
                        key={scene.id}
                        onClick={() => {
                            setCurrentSceneId(scene.id);
                            if (onSceneChange) onSceneChange(scene.id);
                        }}
                        className={`
                            min-w-[60px] h-16 rounded-lg border-2 overflow-hidden transition-all 
                            hover:scale-110
                            ${currentSceneId === scene.id ? "border-blue-500" : "border-white/50"}
                        `}
                    >
                        <img
                            src={getPanoramaUrl(scene.panoramaUrl)}
                            className="w-full h-full object-cover"
                            alt={scene.name}
                            onError={(e) => { e.target.src = '/assets/images/vr_hero_banner.png'; }}
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
