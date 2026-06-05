"use client";

import { Canvas} from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useRef } from "react";
import type { Mesh } from "three";

// The cube itself. Later this becomes the projection surface for pages;
// for now it is a single orange box with a slow idle spin.
function Cube() {
  const ref = useRef<Mesh>(null!);

  return (
    <mesh ref={ref}>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
}

// The scene: camera, lights, the cube, and mouse-drag orbit controls.
export default function CubeScene() {
  return (
    <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Cube />
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
