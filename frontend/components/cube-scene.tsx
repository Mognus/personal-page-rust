"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

import { links, type CubeFace } from "@/features/sidebar/lib/links";

type FacePlacement = {
    position: [number, number, number];
    rotation: [number, number, number];
};

// Helper 1 — projection placement. Maps a face to where its <Html> sits on the
// cube (half-extent 1, nudged out 0.01 to avoid z-fighting) and how to tilt it
// flat onto that face. This does NOT rotate the cube (that's Helper 2, later).
const FACE_PLACEMENT: Record<CubeFace, FacePlacement> = {
    front: { position: [0, 0, 1.01], rotation: [0, 0, 0] },
    back: { position: [0, 0, -1.01], rotation: [0, Math.PI, 0] },
    right: { position: [1.01, 0, 0], rotation: [0, Math.PI / 2, 0] },
    left: { position: [-1.01, 0, 0], rotation: [0, -Math.PI / 2, 0] },
    top: { position: [0, 1.01, 0], rotation: [-Math.PI / 2, 0, 0] },
    bottom: { position: [0, -1.01, 0], rotation: [Math.PI / 2, 0, 0] },
};

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

            {/* Each page's content projected onto its mapped face. The <Html>
                lives inside the mesh, so it rotates with the cube. For now it's
                just the label to verify the face mapping. */}
            {links.map((link) => {
                const placement = FACE_PLACEMENT[link.face];
                return (
                    <Html
                        key={link.href}
                        transform
                        occlude
                        center
                        position={placement.position}
                        rotation={placement.rotation}
                        scale={0.3}
                    >
                        <div
                            style={{
                                width: 200,
                                textAlign: "center",
                                fontSize: 28,
                                fontWeight: 600,
                                color: "white",
                                userSelect: "none",
                            }}
                        >
                            {link.label}
                        </div>
                    </Html>
                );
            })}
        </mesh>
    );
}

// Persistent full-screen scene. Lives in the root layout so it survives
// navigation; page content is layered on top via z-index.
//
// The `fixed` goes on a wrapper, not the Canvas: r3f sizes its renderer from a
// ResizeObserver, and observing a `position: fixed` element reports 0x0 after a
// client navigation (the cube vanishes). The Canvas fills this stable wrapper.
export default function CubeScene() {
    return (
        <div className="fixed inset-0">
            <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Cube />
                <OrbitControls enablePan={false} />
            </Canvas>
        </div>
    );
}
