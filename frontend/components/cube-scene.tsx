"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

// Temporary idle spin: a continuously rotating cube proves the canvas is a
// single persistent instance across navigation (no remount = no reset).
// Later the cube becomes static and snaps the active face to the camera.
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

// Persistent full-screen scene. Lives in the root layout so it survives
// navigation; page content is layered on top via z-index.
export default function CubeScene() {
    return (
        <Canvas
            className="fixed inset-0"
            camera={{ position: [3, 3, 3], fov: 50 }}
        >
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Cube />
            <OrbitControls enablePan={false} />
        </Canvas>
    );
}
