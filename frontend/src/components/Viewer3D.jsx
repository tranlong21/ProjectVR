import React, { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage, Html } from "@react-three/drei";
import Loader from "./common/Loader";
import * as THREE from "three";

import HotspotBillboard from "./HotspotBillboard";
import { getModelUrl } from "../utils/fileUtils";

import { speakDescription, stopSpeaking } from "../utils/speechUtils";
import { Volume2, VolumeX } from "lucide-react";

/* ============ MODEL ============ */
const Model = ({ url, onLoaded }) => {
    const modelUrl = getModelUrl(url);
    const { scene } = useGLTF(modelUrl);

    useEffect(() => {
        if (scene && onLoaded) onLoaded(scene);
    }, [scene, onLoaded]);

    return <primitive object={scene} />;
};

/* ============ CAMERA RESET ============ */
const CameraResetter = ({ controlsRef, depsKey }) => {
    const { camera } = useThree();

    useEffect(() => {
        camera.position.set(4, 4, 6);
        if (controlsRef.current) {
            controlsRef.current.target.set(0, 1, 0);
            controlsRef.current.update();
        }
    }, [camera, controlsRef, depsKey]);

    return null;
};

/* ============ CAMERA WATCHER ============ */
const CameraWatcher = ({ onCameraChange }) => {
    const { camera } = useThree();

    useEffect(() => {
        let lastPos = new THREE.Vector3().copy(camera.position);
        let frameId;

        const loop = () => {
            const moved = camera.position.distanceTo(lastPos) > 0.05;
            if (moved) {
                onCameraChange && onCameraChange();
                lastPos.copy(camera.position);
            }
            frameId = requestAnimationFrame(loop);
        };

        loop();
        return () => cancelAnimationFrame(frameId);
    }, [camera, onCameraChange]);

    return null;
};

/* ============ CAMERA ANIMATOR ============ */
const CameraAnimator = ({ animateTo, controlsRef, onFinish }) => {
    const { camera } = useThree();
    const animRef = useRef(null);

    useEffect(() => {
        if (!animateTo || !controlsRef.current) return;

        const controls = controlsRef.current;
        const duration = 1.2;
        const start = performance.now();

        const startPos = camera.position.clone();
        const endPos = new THREE.Vector3(
            animateTo.camera.x,
            animateTo.camera.y,
            animateTo.camera.z
        );

        const startTarget = controls.target.clone();
        const endTarget = new THREE.Vector3(
            animateTo.target.x,
            animateTo.target.y,
            animateTo.target.z
        );

        const easeInOut = (t) =>
            t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const animate = () => {
            const now = performance.now();
            let t = (now - start) / (duration * 1000);
            if (t >= 1) t = 1;
            const k = easeInOut(t);

            camera.position.x = THREE.MathUtils.lerp(startPos.x, endPos.x, k);
            camera.position.y = THREE.MathUtils.lerp(startPos.y, endPos.y, k);
            camera.position.z = THREE.MathUtils.lerp(startPos.z, endPos.z, k);

            controls.target.x = THREE.MathUtils.lerp(startTarget.x, endTarget.x, k);
            controls.target.y = THREE.MathUtils.lerp(startTarget.y, endTarget.y, k);
            controls.target.z = THREE.MathUtils.lerp(startTarget.z, endTarget.z, k);

            controls.update();

            if (t < 1) {
                animRef.current = requestAnimationFrame(animate);
            } else {
                if (animRef.current) cancelAnimationFrame(animRef.current);
                animRef.current = null;
                onFinish && onFinish();
            }
        };

        animate();

        return () => {
            if (animRef.current) cancelAnimationFrame(animRef.current);
        };
    }, [animateTo, controlsRef, camera, onFinish]);

    return null;
};

/* ============ HOTSPOT PICKER (ADMIN) ============ */
const HotspotPicker = ({ editMode, onAddHotspot, modelRef, controlsRef }) => {
    const { camera, gl } = useThree();
    const raycasterRef = useRef(new THREE.Raycaster());
    const mouseRef = useRef(new THREE.Vector2());

    useEffect(() => {
        const canvas = gl.domElement;

        const handleClick = (e) => {
            if (!editMode) return;
            if (!modelRef.current) return;
            if (!controlsRef.current) return;

            const rect = canvas.getBoundingClientRect();
            mouseRef.current.x =
                ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouseRef.current.y =
                -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycasterRef.current.setFromCamera(mouseRef.current, camera);
            const hits = raycasterRef.current.intersectObject(modelRef.current, true);
            if (!hits.length) return;

            const hitPoint = hits[0].point.clone();
            const camPos = camera.position.clone();
            const target = controlsRef.current.target.clone();

            onAddHotspot(
                { x: hitPoint.x, y: hitPoint.y, z: hitPoint.z },
                { x: camPos.x, y: camPos.y, z: camPos.z },
                { x: target.x, y: target.y, z: target.z }
            );
        };

        canvas.addEventListener("pointerdown", handleClick);
        return () => canvas.removeEventListener("pointerdown", handleClick);
    }, [editMode, gl, camera, onAddHotspot]);

    return null;
};

/* ============ MAIN VIEWER ============ */
const Viewer3D = ({
    modelUrl,
    hotspots = [],
    lang = "vi",
    editMode = false,
    onAddHotspot = () => { },
    onClickHotspot = () => { },
    description = "",
}) => {
    if (!modelUrl || modelUrl.includes("/raw/")) {
        return (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <p className="text-white text-sm">
                    3D model is being processed...
                </p>
            </div>
        );
    }

    const modelRef = useRef(null);
    const controlsRef = useRef(null);

    const [animateTo, setAnimateTo] = useState(null);
    const [activeHotspot, setActiveHotspot] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    const onModelLoaded = (scene) => {
        modelRef.current = scene;
    };

    const goToHotspot = (h) => {
        if (!h) return;
        setAnimateTo({
            camera: {
                x: h.cameraPosX,
                y: h.cameraPosY,
                z: h.cameraPosZ,
            },
            target: {
                x: h.cameraTargetX,
                y: h.cameraTargetY,
                z: h.cameraTargetZ,
            },
        });
        setActiveHotspot(h);
    };

    const handleBillboardClick = (h) => {
        editMode ? onClickHotspot(h) : goToHotspot(h);
    };

    const handleCameraMoved = () => {
        setActiveHotspot(null);
    };

    /* ============ SPEAK BUTTON ============ */
    const handleSpeak = () => {
        if (isSpeaking) {
            stopSpeaking();
            setIsSpeaking(false);
            return;
        }

        setIsSpeaking(true);
        speakDescription(description, lang, () => {
            setIsSpeaking(false);
        });
    };

    const showTimelinePanel = !editMode;

    if (!modelUrl) {
        return (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <p className="text-white">No 3D model available</p>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full bg-gray-900">

            {/* 🔊 BUTTON */}
            <button
                onClick={handleSpeak}
                className="absolute top-3 right-3 z-50 text-white bg-black/40 p-2 rounded-full hover:bg-black/60 transition"
            >
                {isSpeaking ? (
                    <Volume2 className="w-6 h-6 animate-pulse text-purple-300" />
                ) : (
                    <VolumeX className="w-6 h-6 text-purple-300" />
                )}
            </button>

            {showTimelinePanel && (
                <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-50">
                    <button
                        onClick={() =>
                            document
                                .getElementById("timelinePanel")
                                ?.classList.toggle("hidden")
                        }
                        className="px-4 py-2 bg-black/60 text-white rounded-lg backdrop-blur-md"
                    >
                        Hotspots
                    </button>
                </div>
            )}

            {showTimelinePanel && (
                <div
                    id="timelinePanel"
                    className="hidden absolute bottom-20 left-6 w-64 max-h-72 overflow-y-auto p-4 
                    bg-black/70 rounded-xl text-white z-50 backdrop-blur-md"
                >
                    {hotspots.map((h) => (
                        <button
                            key={h.id}
                            onClick={() => goToHotspot(h)}
                            className="flex items-center gap-3 w-full px-3 py-2 mb-2 bg-black/40 rounded-lg hover:bg-white/10"
                        >
                            <div className="w-7 h-7 flex items-center justify-center bg-white/10 rounded-full border border-white/20">
                                {h.orderId}
                            </div>
                            <span>{lang === "vi" ? h.titleVi : h.titleEn}</span>
                        </button>
                    ))}
                </div>
            )}

            <Canvas
                dpr={[1, 2]}
                camera={{ fov: 50 }}
                gl={{
                    antialias: true,
                    preserveDrawingBuffer: false,
                    powerPreference: "high-performance",
                }}
            >
                <Suspense fallback={
                    <Html center>
                        <div className="flex flex-col items-center">
                            <Loader size="lg" />
                            <p className="text-white mt-2 font-bold bg-black/50 px-3 py-1 rounded backdrop-blur-sm">
                                Loading 3D Model...
                            </p>
                        </div>
                    </Html>
                }>
                    <CameraResetter controlsRef={controlsRef} depsKey={modelUrl} />

                    <ambientLight intensity={0.8} />
                    <directionalLight position={[5, 10, 5]} intensity={1.2} />
                    <hemisphereLight
                        skyColor={"#ffffff"}
                        groundColor={"#333333"}
                        intensity={0.6}
                    />

                    <Stage environment="city" intensity={0.6} adjustCamera={false}>
                        <Model url={modelUrl} onLoaded={onModelLoaded} />
                    </Stage>

                    <OrbitControls
                        ref={controlsRef}
                        makeDefault
                        enablePan
                        enableZoom
                        enableRotate
                        enableDamping
                        dampingFactor={0.15}
                        panSpeed={0.8}
                    />

                    <CameraWatcher onCameraChange={handleCameraMoved} />
                    <CameraAnimator
                        animateTo={animateTo}
                        controlsRef={controlsRef}
                        onFinish={() => setAnimateTo(null)}
                    />

                    {editMode && (
                        <HotspotPicker
                            editMode={editMode}
                            onAddHotspot={onAddHotspot}
                            modelRef={modelRef}
                            controlsRef={controlsRef}
                        />
                    )}

                    {hotspots.map((h) => (
                        <HotspotBillboard
                            key={h.id}
                            hotspot={h}
                            active={!editMode && activeHotspot?.id === h.id}
                            onClick={() => handleBillboardClick(h)}
                        />
                    ))}
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Viewer3D;
