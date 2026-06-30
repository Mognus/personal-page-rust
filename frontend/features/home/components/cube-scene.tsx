"use client";

import { Html, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import {
    FileText,
    GraduationCap,
    LogIn,
    Sparkles,
    type LucideIcon,
} from "lucide-react";
import { Suspense, useRef, useState } from "react";
import type { Group, Mesh } from "three";

import { Button } from "@/components/ui/button";
import { useUserStore } from "@/features/auth/store/user-store";
import { BREAKPOINTS } from "@/features/sidebar/lib/breakpoints";
import { useMediaQuery } from "@/hooks/use-media-query";

// A cube face that carries a link. `targetY` is the cube's Y-rotation that
// brings this face to the front (camera looks straight down -Z):
//   +Z face → 0,   +X face → -90°,   -X face → +90°.
// `buttonIcon` / `faceIcon` are optional; omit them and nothing is rendered.
type CubeFace = {
    key: string;
    label: string;
    // Short label for the bottom button; falls back to `label`. Used when the
    // face label is a full sentence (the login CTA) that would overflow.
    buttonLabel?: string;
    href: string;
    newTab: boolean;
    targetY: number;
    position: [number, number, number];
    rotation: [number, number, number];
    buttonIcon?: LucideIcon;
    faceIcon?: LucideIcon;
};

// Signed-in view: the gated documents. `key` matches the whitelist in
// app/api/docs/[name]/route.ts; the route is the real gate (401 without auth).
const DOC_FACES: CubeFace[] = [
    {
        key: "cv",
        label: "Lebenslauf",
        href: "/api/docs/cv",
        newTab: true,
        targetY: 0,
        position: [0, 0, 1.01],
        rotation: [0, 0, 0],
        buttonIcon: FileText,
        faceIcon: FileText,
    },
    {
        key: "zeugnisse",
        label: "Zeugnis",
        href: "/api/docs/zeugnisse",
        newTab: true,
        targetY: -Math.PI / 2,
        position: [1.01, 0, 0],
        rotation: [0, Math.PI / 2, 0],
        buttonIcon: GraduationCap,
        faceIcon: GraduationCap,
    },
    {
        key: "abilities",
        label: "Fähigkeiten",
        href: "/api/docs/abilities",
        newTab: true,
        targetY: Math.PI / 2,
        position: [-1.01, 0, 0],
        rotation: [0, -Math.PI / 2, 0],
        buttonIcon: Sparkles,
        faceIcon: Sparkles,
    },
];

// Signed-out view: a single login call-to-action instead of the documents.
const GUEST_FACES: CubeFace[] = [
    {
        key: "login",
        label: "Für mehr Zugriff – z.B. Zeugnis & Lebenslauf – einloggen",
        buttonLabel: "Einloggen",
        href: "/login",
        newTab: false,
        targetY: 0,
        position: [0, 0, 1.01],
        rotation: [0, 0, 0],
        buttonIcon: LogIn,
        faceIcon: LogIn,
    },
];

// Documents open in a new tab; the login link replaces the current page.
function activate(face: CubeFace) {
    if (face.newTab) {
        window.open(face.href, "_blank", "noopener");
    } else {
        window.location.href = face.href;
    }
}

// Profile-image cube whose faces carry the given links. When `lockedY` is null
// it spins freely; otherwise it eases to that Y-rotation and holds (fixed face).
function Cube({
    scale,
    lockedY,
    faces,
}: {
    scale: number;
    lockedY: number | null;
    faces: CubeFace[];
}) {
    const groupRef = useRef<Group>(null!);
    const meshRef = useRef<Mesh>(null!);
    const texture = useTexture("/magnus-profile-image.jpg");

    useFrame((_, delta) => {
        const group = groupRef.current;
        if (lockedY === null) {
            group.rotation.y += delta * 0.3;
            return;
        }
        // Snap to the rotation-equivalent of lockedY nearest the current angle
        // so the cube takes the short way round instead of unwinding.
        const twoPi = Math.PI * 2;
        const current = group.rotation.y;
        const target = lockedY + twoPi * Math.round((current - lockedY) / twoPi);
        group.rotation.y += (target - current) * Math.min(1, delta * 6);
    });

    return (
        <group ref={groupRef} scale={scale}>
            <mesh ref={meshRef}>
                <boxGeometry args={[2, 2, 2]} />
                <meshStandardMaterial map={texture} />
            </mesh>
            {faces.map((face) => {
                const FaceIcon = face.faceIcon;
                return (
                    <Html
                        key={face.key}
                        position={face.position}
                        rotation={face.rotation}
                        transform
                        center
                        occlude={[meshRef]}
                        // Keep the face DOM below the sidebar overlay (z-40);
                        // drei defaults to a huge z-index, so it would otherwise
                        // sit on top, stay clickable, and shine through.
                        zIndexRange={[30, 0]}
                        // Sharpness trick: the inner element is sized at 4x and
                        // scaled back down here, so the text rasterizes crisp
                        // instead of being upscaled (blurry). Lowering this only
                        // shrinks the face (stays crisp); keep the 4x inner
                        // dimensions if you enlarge it again.
                        scale={0.17}
                    >
                        <button
                            type="button"
                            onClick={() => activate(face)}
                            // The face sits on the (constant) profile photo, so
                            // the text must not follow the theme colour. Fixed
                            // light text + a soft shadow stays readable over both
                            // the bright and dark areas of the photo, in either mode.
                            className="flex w-[720px] cursor-pointer flex-col items-center justify-center gap-6 px-12 py-12 text-center text-4xl font-medium tracking-wide whitespace-normal text-white/90 uppercase drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] transition-colors hover:text-white"
                        >
                            {FaceIcon && <FaceIcon className="size-24" />}
                            <span className="leading-tight">{face.label}</span>
                        </button>
                    </Html>
                );
            })}
        </group>
    );
}

// Self-contained scene; fills its nearest positioned ancestor (parent needs
// `relative`). The buttons rotate a face to the front and fix it; clicking the
// active button again releases the cube back into its idle spin. Signed-out
// visitors get the login face/button instead of the documents.
export default function CubeScene() {
    const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`);
    const scale = isMobile ? 0.5 : 1.05;
    const [lockedY, setLockedY] = useState<number | null>(null);

    // The /api/docs route is the real gate; this just swaps the UX.
    const signedIn = useUserStore((s) => Boolean(s.user));
    const faces = signedIn ? DOC_FACES : GUEST_FACES;

    const toggleFace = (targetY: number) =>
        setLockedY((current) => (current === targetY ? null : targetY));

    return (
        <div className="absolute inset-0">
            <Canvas camera={{ position: [0, 0, 4.2], fov: 50 }}>
                <ambientLight intensity={0.6} />
                <directionalLight position={[5, 5, 5]} intensity={1} />
                <Suspense fallback={null}>
                    <Cube scale={scale} lockedY={lockedY} faces={faces} />
                </Suspense>
            </Canvas>

            <div className="absolute bottom-6 left-1/2 z-10 flex max-w-[calc(100vw-2rem)] -translate-x-1/2 flex-wrap justify-center gap-2">
                {faces.map((face) => {
                    const ButtonIcon = face.buttonIcon;
                    return (
                        <Button
                            key={face.key}
                            size="sm"
                            variant={
                                lockedY === face.targetY ? "default" : "outline"
                            }
                            onClick={() => toggleFace(face.targetY)}
                        >
                            {ButtonIcon && <ButtonIcon />}
                            {face.buttonLabel ?? face.label}
                        </Button>
                    );
                })}
            </div>
        </div>
    );
}
