// import React, { useRef } from "react";
// import { Text, Billboard } from "@react-three/drei";
// import * as THREE from "three";

// export default function HotspotBillboard({ hotspot, active, onClick }) {
//     const scale = active ? 1.4 : 1.5; // 👈 Hotspot active sẽ to hơn

//     return (
//         <Billboard // 👈 luôn facing camera
//             position={[hotspot.x, hotspot.y, hotspot.z]}
//             onClick={(e) => {
//                 e.stopPropagation();
//                 onClick?.(hotspot);
//             }}
//             follow
//             lockX={false}
//             lockY={false}
//             lockZ={false}
//         >
//             {/* VÒNG TRÒN */}
//             <mesh scale={0.25 * scale}> 
//                 <circleGeometry args={[1, 32]} />
//                 <meshBasicMaterial
//                     color="#ffffff"
//                     transparent
//                     opacity={0.9}
//                 />
//             </mesh>

//             {/* VÒNG ĐEN BÊN TRONG */}
//             <mesh scale={0.18 * scale} position={[0, 0, 0.01]}>
//                 <circleGeometry args={[1, 32]} />
//                 <meshBasicMaterial color="#000000" />
//             </mesh>

//             {/* TEXT SỐ */}
//             <Text
//                 position={[0, 0, 0.02]}
//                 fontSize={0.25 * scale} // 👈 tăng để số to hơn
//                 color="white"
//                 anchorX="center"
//                 anchorY="middle"
//                 fontWeight={700}
//             >
//                 {hotspot.orderId}
//             </Text>
//         </Billboard>
//     );
// }
import { Html } from "@react-three/drei";

export default function HotspotBillboard({ hotspot, active, onClick }) {
  return (
    <Html
      position={[hotspot.x, hotspot.y, hotspot.z]}
      center
      transform={false}     // 🔥 CỐ ĐỊNH PIXEL THEO VIEWER
      zIndexRange={[100, 0]}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick?.(hotspot);
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "rgba(0,0,0,0.7)",
          color: "#fff",
          fontWeight: 700,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          userSelect: "none",
          outline: active ? "2px solid #a855f7" : "none",
          transition: "all 0.2s ease",
        }}
      >
        {hotspot.orderId}
      </div>
    </Html>
  );
}
