"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

// A simple orange cube with a slow idle spin. Self-contained and reusable —
// fills its nearest positioned ancestor (give the parent `relative`).
function Cube() {
    const ref = useRef<Mesh>(null!);

    useFrame((_, delta) => {
        ref.current.rotation.y += delta * 0.3;
    });

    return (
        <mesh ref={ref}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
}

export default function CubeScene() {
    return (
        <div className="absolute inset-0">
            <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Cube />
                <OrbitControls enablePan={false} />
            </Canvas>
        </div>
    );
}
