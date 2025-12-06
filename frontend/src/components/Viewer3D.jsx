import React, { Suspense, useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import * as THREE from "three";
import { getModelUrl } from "../utils/fileUtils";


// ================= MODEL =================
const Model = ({ url, onLoaded }) => {
    const modelUrl = getModelUrl(url);
    const { scene } = useGLTF(modelUrl);

    useEffect(() => {
        if (!scene) return;
        onLoaded && onLoaded(scene);
    }, [scene]);

    return <primitive object={scene} />;
};


// ================= HOTSPOT ICON =================
const HotspotIcon = ({ x, y, z, onClick }) => (
    <mesh
        position={[x, y, z]}
        onClick={(e) => {
            e.stopPropagation();
            onClick();
        }}
    >
        <sphereGeometry args={[0.12, 32, 32]} />
        <meshStandardMaterial color="yellow" emissive="orange" />
    </mesh>
);


// ================= HOTSPOT PICKER =================
// ================= HOTSPOT PICKER =================
const HotspotPicker = ({ editMode, onAddHotspot, modelRef }) => {
    const { camera, gl } = useThree();
    const raycaster = useRef(new THREE.Raycaster());
    const mouse = useRef(new THREE.Vector2());
    const controlsRef = useRef();

    useEffect(() => {
        const canvas = gl.domElement;

        const handleClick = (e) => {
            if (!editMode) return;
            if (!modelRef.current) return;
            if (!controlsRef.current) return;

            const rect = canvas.getBoundingClientRect();

            mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.current.setFromCamera(mouse.current, camera);

            const hits = raycaster.current.intersectObject(modelRef.current, true);
            if (!hits.length) return;

            const hit = hits[0].point.clone();

            const camPos = camera.position.clone();
            const target = controlsRef.current.target.clone();

            onAddHotspot(
                { x: hit.x, y: hit.y, z: hit.z },
                { x: camPos.x, y: camPos.y, z: camPos.z },
                { x: target.x, y: target.y, z: target.z }
            );
        };

        canvas.addEventListener("pointerdown", handleClick);
        return () => canvas.removeEventListener("pointerdown", handleClick);
    }, [editMode, gl, camera, onAddHotspot]);

    // ❌ ĐÃ BỎ autoRotate — KHÔNG XOAY NỮA
    return <OrbitControls ref={controlsRef} makeDefault />;
};


// ================= MAIN VIEWER =================
const Viewer3D = ({
    modelUrl,
    editMode = false,
    hotspots = [],
    onAddHotspot = () => {},
    onClickHotspot = () => {},
}) => {
    const modelRef = useRef(null);

    const onModelLoaded = (scene) => {
        modelRef.current = scene;
    };

    if (!modelUrl) {
        return (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <p className="text-white">No 3D model available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gray-900">
            <Canvas
                dpr={[1, 2]}
                camera={{ fov: 50 }}
                gl={{
                    antialias: true,
                    preserveDrawingBuffer: false,
                    powerPreference: "high-performance",
                }}
            >
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.6}>
                        <Model url={modelUrl} onLoaded={onModelLoaded} />
                    </Stage>

                    {/* HOTSPOT CLICK ENGINE */}
                    <HotspotPicker
                        editMode={editMode}
                        onAddHotspot={onAddHotspot}
                        modelRef={modelRef}
                    />

                    {/* EXISTING HOTSPOTS */}
                    {hotspots.map((h) => (
                        <HotspotIcon
                            key={h.id}
                            x={h.x}
                            y={h.y}
                            z={h.z}
                            onClick={() => onClickHotspot(h)}
                        />
                    ))}
                </Suspense>
            </Canvas>
        </div>
    );
};

export default Viewer3D;
