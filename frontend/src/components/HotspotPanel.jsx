import { Html } from "@react-three/drei";
import React from "react";

export default function HotspotBillboard({ hotspot, active, onClick }) {
    const isActive = active;

    return (
        <group
            position={[hotspot.x, hotspot.y, hotspot.z]}
            onClick={(e) => {
                e.stopPropagation();
                console.log("🔥 CLICK BILLBOARD:", hotspot);
                onClick(hotspot);
            }}
        >
            {/* Bubble số */}
            <Html
                center
                pointerEvents="auto"   // Cho hover
                onPointerDown={(e) => e.stopPropagation()} 
                onPointerUp={(e) => e.stopPropagation()}
                style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: "rgba(0,0,0,0.65)",
                    border: "2px solid #ffffff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 700,
                    fontSize: "14px",
                    color: "#ffffff",
                    cursor: "pointer",   // ⭐ Chuột đổi thành bàn tay
                    userSelect: "none",
                }}
            >
                {hotspot.orderId}
            </Html>

            {/* Title */}
            {isActive && (
                <Html
                    position={[0.4, 0.15, 0]}
                    pointerEvents="none"
                    style={{
                        padding: "6px 12px",
                        background: "rgba(0,0,0,0.75)",
                        color: "white",
                        borderRadius: 6,
                        fontSize: "14px",
                        whiteSpace: "nowrap",
                    }}
                >
                    {hotspot.titleVi}
                </Html>
            )}
        </group>
    );
}
