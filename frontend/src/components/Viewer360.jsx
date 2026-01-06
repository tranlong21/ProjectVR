/* --- FILE: src/components/Viewer360.js --- */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import 'pannellum/build/pannellum.css';
import 'pannellum';
import { getPanoramaUrl } from '../utils/fileUtils';
import HandTracker from '../gesture/HandTracker';
import GestureCameraPreview from '../components/gesture-ui/GestureCameraPreview';
import GestureHelpPanel from '../components/gesture-ui/GestureHelpPanel';
import { GestureType } from "../gesture/GestureType";

const Viewer360 = ({
  scenes = [],
  initialSceneId = null,
  i18n = { language: 'vi' },
  onSceneChange,
}) => {
  const wrapperRef = useRef(null);
  const viewerContainer = useRef(null);
  const viewerInstance = useRef(null);

  const mouseEventsAttached = useRef(false);
  const lastHoveredElement = useRef(null);
  const lastClickTimeRef = useRef(0);

  // ✅ Track "effective" gesture to avoid flicker mixing actions
  const prevGestureTypeRef = useRef(GestureType.NONE);
  const stableTypeRef = useRef({ type: GestureType.NONE, count: 0 });

  // ✅ Gesture ref (apply camera in RAF, not tied to React render)
  const gestureRef = useRef(null);
  const justReleasedPalmRef = useRef(false);

  const rotateDragRef = useRef({
    active: false,
    startX: 0,
    startY: 0,
    startYaw: 0,
    startPitch: 0,
  });

  /* logic specific refs */
  const lastFramePosRef = useRef({ x: 0, y: 0 });

  const [vrEnabled, setVrEnabled] = useState(false);
  const [gestureState, setGestureState] = useState(null);
  const [cursorPos, setCursorPos] = useState({
    x: 0,
    y: 0,
    visible: false,
    isHovering: false
  });
  const [currentSceneId, setCurrentSceneId] = useState(initialSceneId || (scenes[0]?.id));
  const [isFullscreen, setIsFullscreen] = useState(false);

  // ✅ viewer ready flag to avoid gesture actions before panorama loaded
  const [viewerReady, setViewerReady] = useState(false);

  // Normalize id to avoid number/string mismatch for scene switching
  const normalizeId = (id) => (id == null ? '' : String(id));

  const noteRotateReset = () => {
    rotateDragRef.current.active = false;

    rotateDragRef.current.startX = 0;
    rotateDragRef.current.startY = 0;
    rotateDragRef.current.startYaw = 0;
    rotateDragRef.current.startPitch = 0;

    justReleasedPalmRef.current = true;
  };

  const findHotspotAtPoint = (x, y) => {
    const elements = document.elementsFromPoint(x, y);

    for (let el of elements) {
      // 1) Custom hotspots (url/link_scene) - your own DOM
      const custom = el.closest('.custom-hotspot');
      if (custom) return custom;

      // 2) Pannellum default hotspots (info)
      const pnlm = el.closest('.pnlm-hotspot') || el.closest('.pnlm-hotspot-base');
      if (pnlm) return pnlm;
    }
    return null;
  };

  const simulateHover = (targetElement, x, y, isGesture = true) => {
    // 1) Handle LEAVING a hotspot
    if (lastHoveredElement.current && lastHoveredElement.current !== targetElement) {
      const prev = lastHoveredElement.current;
      prev.classList.remove('force-hover', 'force-pnlm-hover');

      // Dispatch "leave" events to clear tooltips
      prev.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, clientX: x, clientY: y }));
      prev.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true, clientX: x, clientY: y }));

      lastHoveredElement.current = null;
    }

    // 2) Always keep Pannellum alive with mousemove on container (prevents idle timeout)
    // ONLY if it comes from Gesture (prevent spamming real mouse)
    if (isGesture && viewerContainer.current) {
      viewerContainer.current.dispatchEvent(
        new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y })
      );
    }

    if (!targetElement) return;

    // 3) Handle ENTERING a hotspot
    let actualTarget = targetElement;

    // Resolve Custom Hotspots
    if (targetElement.classList.contains('custom-hotspot') || targetElement.closest('.custom-hotspot')) {
      actualTarget = targetElement.closest('.custom-hotspot') || targetElement;
      actualTarget.classList.add('force-hover');
    }
    // Resolve Pannellum Info Hotspots
    else if (targetElement.classList.contains('pnlm-hotspot-base') || targetElement.closest('.pnlm-hotspot-base')) {
      actualTarget = targetElement.closest('.pnlm-hotspot-base') || targetElement;
      // FIX: Add BOTH classes to ensure inline styles (force-hover) AND global styles (force-pnlm-hover) work
      actualTarget.classList.add('force-pnlm-hover', 'force-hover');
    }

    // Dispatch Events to trigger internal listeners
    if (actualTarget) {
      actualTarget.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, clientX: x, clientY: y }));
      actualTarget.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true, clientX: x, clientY: y }));
      actualTarget.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: x, clientY: y }));
      lastHoveredElement.current = actualTarget;
    }
  };

  const openUrlSafely = (rawUrl) => {
    if (!rawUrl) return;
    const href = rawUrl.startsWith('http') ? rawUrl : `https://${rawUrl}`;
    const a = document.createElement('a');
    a.href = href;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.click();
  };

  const simulateClick = (targetElement) => {
    if (targetElement) {
      targetElement.classList.add('clicked-anim');
      const clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
      targetElement.dispatchEvent(clickEvent);
      setTimeout(() => targetElement.classList.remove('clicked-anim'), 200);
    }
  };

  const getIconFile = (hotspot) => {
    if (hotspot.type === 'link_scene') return `/assets/icons/${hotspot.icon || 'arrow_right'}.png`;
    if (hotspot.type === 'info') return '/assets/icons/info.png';
    if (hotspot.type === 'url') return '/assets/icons/link.png';
    return null;
  };

  const buildHotspots = (scene) => {
    return (scene.hotspots || []).map((hotspot) => ({
      pitch: hotspot.pitch,
      yaw: hotspot.yaw,
      type: hotspot.type === 'info' ? 'info' : 'custom',
      text: hotspot.type === 'info'
        ? (i18n.language === 'vi'
          ? (hotspot.titleVi || hotspot.descriptionVi)
          : (hotspot.titleEn || hotspot.descriptionEn))
        : undefined,
      createTooltipFunc: hotspot.type !== 'info'
        ? (div) => {
          div.classList.add('custom-hotspot');
          div.style.pointerEvents = 'auto';
          const iconPath = getIconFile(hotspot);
          const tooltipText = hotspot.type === 'link_scene'
            ? (scenes.find(s => normalizeId(s.id) === normalizeId(hotspot.targetSceneId))?.name || 'Scene')
            : (i18n.language === 'vi' ? hotspot.descriptionVi : hotspot.descriptionEn);

          div.dataset.hotspotType = hotspot.type;
          if (hotspot.type === 'link_scene') div.dataset.targetSceneId = hotspot.targetSceneId || '';
          if (hotspot.type === 'url') div.dataset.url =
            (i18n.language === 'vi' ? hotspot.descriptionVi : hotspot.descriptionEn) || '';

          div.innerHTML =
            `<img src="${iconPath}" class="hotspot-icon" />` +
            `<div class="hotspot-tooltip">${tooltipText}</div>`;
        }
        : null,
      clickHandlerFunc: () => {
        if (hotspot.type === 'link_scene') {
          setCurrentSceneId(normalizeId(hotspot.targetSceneId));
          onSceneChange?.(hotspot.targetSceneId);
        }
        if (hotspot.type === 'url') {
          const url = i18n.language === 'vi' ? hotspot.descriptionVi : hotspot.descriptionEn;
          if (url) window.open(url.startsWith('http') ? url : `https://${url}`, '_blank');
        }
      },
    }));
  };

  const loadScene = (scene) => {
    if (!viewerContainer.current) return;

    // ✅ lock gesture until viewer load finishes
    setViewerReady(false);

    // reset rotate anchors when switching scenes
    noteRotateReset();

    if (viewerInstance.current) {
      try { viewerInstance.current.destroy(); } catch (e) { }
    }

    viewerInstance.current = window.pannellum.viewer(viewerContainer.current, {
      type: 'equirectangular',
      panorama: getPanoramaUrl(scene.panoramaUrl),
      autoLoad: true,
      showControls: false,
      showFullscreen: false,
      hfov: 100,
      minHfov: 20,
      maxHfov: 150,
      hotSpots: [],
    });

    const spots = buildHotspots(scene);
    spots.forEach(h => {
      try { viewerInstance.current.addHotSpot(h); } catch (e) { }
    });

    viewerInstance.current.on('load', () => {
      mouseEventsAttached.current = true;
      setViewerReady(true);
    });
  };

  // ✅ when VR toggles ON, reset refs to prevent jump / phantom actions
  useEffect(() => {
    if (vrEnabled) {
      prevGestureTypeRef.current = GestureType.NONE;
      stableTypeRef.current = { type: GestureType.NONE, count: 0 };
      lastClickTimeRef.current = 0;
      gestureRef.current = null;

      noteRotateReset();

      setCursorPos({ x: 0, y: 0, visible: false, isHovering: false });
      simulateHover(null, 0, 0);
    } else {
      // when VR OFF also reset anchors
      noteRotateReset();
    }
  }, [vrEnabled]);

  useEffect(() => {
    if (!vrEnabled) return;

    let rafId = null;

    const tick = () => {
      const viewer = viewerInstance.current;
      const g = gestureRef.current;

      // Ensure viewer and tracking are ready
      if (!viewer || !g || !g.isTracking || !viewerReady) {
        lastFramePosRef.current = { x: g?.x || 0, y: g?.y || 0 };
        rafId = requestAnimationFrame(tick);
        return;
      }

      // Calculate localized delta (mimic gestureState.deltaX)
      const deltaX = g.x - lastFramePosRef.current.x;
      const deltaY = g.y - lastFramePosRef.current.y;
      lastFramePosRef.current = { x: g.x, y: g.y };

      // Map User Snippet GESTURES to Existing Enums:
      // FIVE_FINGERS (Snippet) -> PINCH (Current impl, or OPEN_PALM?)
      // Wait, User Snippet: FIVE_FINGERS || TWO_HANDS = ZOOM.
      // Existing: PINCH || TWO_HANDS = ZOOM.
      // We will use existing PINCH / TWO_HANDS for Zoom.

      /* ================== ZOOM IN / OUT ================== */
      if (
        g.type === GestureType.PINCH ||
        g.type === GestureType.TWO_HANDS
      ) {
        const baseFov = 75; // As per snippet

        // Snippet: targetFov = baseFov * (1 / gestureState.zoomFactor);
        const targetFov = baseFov * (1 / g.zoomFactor);
        const clampedFov = Math.max(30, Math.min(100, targetFov));

        // Use Pannellum setHfov (equivalent to camera.fov)
        const currentFov = viewer.getHfov();
        const nextFov = THREE.MathUtils.lerp(
          currentFov,
          clampedFov,
          0.1
        );

        viewer.setHfov(nextFov);
        // camera.updateProjectionMatrix(); // Implicit in viewer
      }

      /* ================== XOAY CAMERA ================== */
      // User Snippet: OK_GESTURE. 
      // Existing: OPEN_PALM used for rotation.
      if (g.type === GestureType.OPEN_PALM) {
        const rotationSpeed = 2.5; // As per snippet

        // Pannellum uses Yaw/Pitch. 
        // We map to Spherical to follow logic Y HỆT.
        // Pannellum Yaw = Theta (approx). Pitch = 90 - Phi_deg.

        const currentYaw = viewer.getYaw();
        const currentPitch = viewer.getPitch();

        // Convert to Spherical (Radius=10)
        // phi: 0..PI (Top..Bottom). Pitch: 90..-90 (Top..Bottom).
        const phi = THREE.MathUtils.degToRad(90 - currentPitch);
        const theta = THREE.MathUtils.degToRad(currentYaw);

        const spherical = new THREE.Spherical(10, phi, theta);

    
        spherical.theta -= deltaX * rotationSpeed * 10; 
        spherical.theta -= deltaX * rotationSpeed * 5; // Tuning for Pannellum scale
        spherical.phi -= deltaY * rotationSpeed * 5;

        spherical.phi = Math.max(
          0.1,
          Math.min(Math.PI - 0.1, spherical.phi)
        );

        // Convert back to Yaw/Pitch
        // Pitch = 90 - deg(phi)
        const newPitch = 90 - THREE.MathUtils.radToDeg(spherical.phi);
        const newYaw = THREE.MathUtils.radToDeg(spherical.theta);

        // camera.position.setFromSpherical(spherical);
        // camera.lookAt(0, 0, 0);
        // In Pannellum, we just set the angles.
        viewer.setYaw(newYaw);
        viewer.setPitch(newPitch);
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => rafId && cancelAnimationFrame(rafId);
  }, [vrEnabled, viewerReady]);


  const handleGestureUpdate = useCallback((state) => {
    if (!viewerContainer.current) return;

    setGestureState(state);
    gestureRef.current = state;

    if (!viewerReady) return;

    const rect = viewerContainer.current.getBoundingClientRect();
    const screenX = rect.left + state.x * rect.width;
    const screenY = rect.top + state.y * rect.height;

    const isInside = state.x >= 0 && state.x <= 1 && state.y >= 0 && state.y <= 1;

    // Reset cursor if lost tracking or non-interactive gesture
    if (!state.isTracking ||
      state.type === GestureType.NONE ||
      state.type === GestureType.CLOSED_FIST ||
      state.type === GestureType.OPEN_PALM ||
      state.type === GestureType.PINCH ||
      state.type === GestureType.TWO_HANDS) {

      // ✅ Pass false to avoid spamming container mousemove, allowing real mouse to work
      simulateHover(null, screenX, screenY, false);
      setCursorPos(p => ({ ...p, visible: false, isHovering: false }));
      return;
    }

    // INTERACTIVE MODES (ONE_FINGER, TWO_FINGERS)
    if (state.type === GestureType.ONE_FINGER || state.type === GestureType.TWO_FINGERS) {
      const target = isInside ? findHotspotAtPoint(screenX, screenY) : null;

      setCursorPos({
        x: screenX,
        y: screenY,
        visible: isInside,
        isHovering: !!target
      });

      // Pass screen coordinates explicitly to simulateHover
      simulateHover(isInside ? target : null, screenX, screenY);

      // CLICK ACTION (TWO_FINGERS)
      if (state.type === GestureType.TWO_FINGERS && target) {
        const now = Date.now();
        if (now - lastClickTimeRef.current > 600) { // Slight debounce increase
          const hotspotEl = target.classList.contains('custom-hotspot')
            ? target
            : target.closest('.custom-hotspot');
          const ds = hotspotEl?.dataset;

          if (ds?.hotspotType === 'link_scene' && ds?.targetSceneId) {
            setCurrentSceneId(normalizeId(ds.targetSceneId));
            onSceneChange?.(ds.targetSceneId);
          } else if (ds?.hotspotType === 'url' && ds?.url) {
            openUrlSafely(ds.url);
          } else {
            simulateClick(target);
          }

          lastClickTimeRef.current = now;
        }
      }
    }
  }, [viewerReady, onSceneChange]);

  const stopVR = () => {
    setVrEnabled(false);
    setGestureState(null);
    gestureRef.current = null;

    noteRotateReset();

    setCursorPos({ x: 0, y: 0, visible: false, isHovering: false });
    simulateHover(null, 0, 0);
    prevGestureTypeRef.current = GestureType.NONE;
    stableTypeRef.current = { type: GestureType.NONE, count: 0 };
  };

  const handleFullscreen = () => {
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (wrapperRef.current?.requestFullscreen) {
        wrapperRef.current.requestFullscreen().catch(e => console.error(e));
      } else if (wrapperRef.current?.webkitRequestFullscreen) {
        wrapperRef.current.webkitRequestFullscreen(); 
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const s = scenes.find(x => normalizeId(x.id) === normalizeId(currentSceneId));
    if (s) loadScene(s);
  }, [currentSceneId, scenes]);

  return (
    <div ref={wrapperRef} className="relative w-full h-full bg-gray-900 group select-none overflow-hidden touch-none">
      <style>{`
        .pnlm-controls-container, .pnlm-fullscreen-toggle { display: none !important; }

        /* Force-hover for both pannellum info hotspots and custom hotspots */
        .pnlm-hotspot-base.force-hover .pnlm-tooltip span,
        .pnlm-hotspot.force-hover .pnlm-tooltip span,
        .custom-hotspot.force-hover .hotspot-tooltip {
          visibility: visible !important;
          opacity: 1 !important;
        }

        .clicked-anim { animation: clickPulse 0.2s; }
        @keyframes clickPulse {
          0% { transform: scale(1); }
          50% { transform: scale(0.8); }
          100% { transform: scale(1); }
        }

        .hotspot-icon { width: 28px; height: 28px; transition: transform 0.2s; }
        .force-hover .hotspot-icon { transform: scale(1.2); }

        .custom-hotspot, .custom-hotspot * { pointer-events: auto !important; }
      `}</style>

      <div ref={viewerContainer} className="w-full h-full" />

      {vrEnabled && <div className="absolute inset-0 z-20 pointer-events-none" />}

      {vrEnabled && cursorPos.visible && (
        <div
          className="fixed z-[100] pointer-events-none transition-transform duration-75 ease-out"
          style={{
            left: 0,
            top: 0,
            transform: `translate(${cursorPos.x}px, ${cursorPos.y}px)`
          }}
        >
          <div
            className={`w-4 h-4 -ml-4 -mt-4 rounded-full border-2 border-white shadow-xl
              flex items-center justify-center transition-all duration-100
              ${gestureState?.type === GestureType.TWO_FINGERS
                ? 'bg-green-500 scale-125'
                : 'bg-red-500/40'
              }`}
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
        </div>
      )}

      <HandTracker
        isActive={vrEnabled}
        onGestureUpdate={handleGestureUpdate}
      />

      <div className="absolute bottom-4 left-2 z-30 flex flex-col gap-2">
        <button
          onClick={handleFullscreen}
          className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center hover:bg-white shadow-lg active:scale-90 transition-all"
        >
          <img src="/assets/icons/fullscreen.png" className="w-5 h-5 opacity-80" alt="FS" />
        </button>

        <button
          onClick={vrEnabled ? stopVR : () => setVrEnabled(true)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg active:scale-90 transition-all
            ${vrEnabled ? 'bg-purple-600 text-white' : 'bg-white/90 hover:bg-white'}`}
        >
          <img src="/assets/icons/vr.png" className="w-6 h-6" alt="VR" />
        </button>
      </div>

      {vrEnabled && <GestureCameraPreview gestureState={gestureState} i18n={i18n} />}
      {vrEnabled && <GestureHelpPanel i18n={i18n} />}

      {scenes.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-black/70 p-2 rounded-full backdrop-blur-sm z-30 max-w-[90%] overflow-x-auto no-scrollbar border border-white/10">
          {scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => { setCurrentSceneId(normalizeId(scene.id)); onSceneChange?.(scene.id); }}
              className={`min-w-[60px] h-16 rounded-lg border-2 overflow-hidden transition-all hover:scale-110
                ${normalizeId(currentSceneId) === normalizeId(scene.id) ? 'border-blue-500' : 'border-white/50'}`}
            >
              <img
                src={getPanoramaUrl(scene.panoramaUrl)}
                className="w-full h-full object-cover"
                alt={scene.name}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Viewer360;