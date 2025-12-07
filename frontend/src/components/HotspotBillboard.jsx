import React, { useRef } from "react";
import { Text, Billboard } from "@react-three/drei";
import * as THREE from "three";

export default function HotspotBillboard({ hotspot, active, onClick }) {
    const scale = active ? 1.4 : 1.5; // 👈 Hotspot active sẽ to hơn

    return (
        <Billboard // 👈 luôn facing camera
            position={[hotspot.x, hotspot.y, hotspot.z]}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(hotspot);
            }}
            follow
            lockX={false}
            lockY={false}
            lockZ={false}
        >
            {/* VÒNG TRÒN */}
            <mesh scale={0.25 * scale}> 
                <circleGeometry args={[1, 32]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.9}
                />
            </mesh>

            {/* VÒNG ĐEN BÊN TRONG */}
            <mesh scale={0.18 * scale} position={[0, 0, 0.01]}>
                <circleGeometry args={[1, 32]} />
                <meshBasicMaterial color="#000000" />
            </mesh>

            {/* TEXT SỐ */}
            <Text
                position={[0, 0, 0.02]}
                fontSize={0.25 * scale} // 👈 tăng để số to hơn
                color="white"
                anchorX="center"
                anchorY="middle"
                fontWeight={700}
            >
                {hotspot.orderId}
            </Text>
        </Billboard>
    );
}
