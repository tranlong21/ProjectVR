import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, Stage } from '@react-three/drei';
import { getModelUrl } from '../utils/fileUtils';

const Model = ({ url }) => {
    const modelUrl = getModelUrl(url);
    const { scene } = useGLTF(modelUrl);
    return <primitive object={scene} />;
};

const Viewer3D = ({ modelUrl }) => {
    if (!modelUrl) {
        return (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                <p className="text-white">No 3D model available</p>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-gray-900">
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
