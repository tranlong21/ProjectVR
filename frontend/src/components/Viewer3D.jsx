import React, { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Stage } from "@react-three/drei";
import { getModelUrl } from "../utils/fileUtils";
import { speakDescription, stopSpeaking } from "../utils/speechUtils";
import { Volume2, VolumeX } from "lucide-react";

const Model = ({ url }) => {
    const modelUrl = getModelUrl(url);
    const { scene } = useGLTF(modelUrl);
    return <primitive object={scene} />;
};

const Viewer3D = ({ modelUrl, description, lang }) => {
    const [isSpeaking, setIsSpeaking] = useState(false);

    if (!modelUrl) {
        return (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <p className="text-white">No 3D model available</p>
            </div>
        );
    }

    const handleSpeak = () => {
        if (!isSpeaking) {
            // 🔊 Bắt đầu đọc
            setIsSpeaking(true);
            speakDescription(description, lang, () => {
                setIsSpeaking(false); // 📌 Đọc xong → icon tắt
            });
        } else {
            // ⏹ Dừng đọc
            stopSpeaking();
            setIsSpeaking(false);
        }
    };

    return (
        <div className="relative w-full h-full bg-gray-900">

            {/* 🔊 NÚT LOA */}
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

            {/* 🎧 CANVAS 3D */}
            <Canvas shadows dpr={[1, 2]} camera={{ fov: 50 }}>
                <Suspense fallback={null}>
                    <Stage environment="city" intensity={0.6}>
                        <Model url={modelUrl} />
                    </Stage>
                </Suspense>
                <OrbitControls autoRotate />
            </Canvas>
        </div>
    );
};

export default Viewer3D;
