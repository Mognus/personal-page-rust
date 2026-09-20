"use client";

import { useEffect, useRef, useState } from "react";

interface ShockwaveWrapperProps {
    children: React.ReactNode;
    waves?: number;
    duration?: number;
    targetW: number;
    targetH: number;
    staticBorder?: boolean;
    gap?: number;
    className?: string;
}

// Renders `waves` border rings that scale outward on a loop (the `shockwave`
// keyframes), scaled so each ring grows from the inner box to the target box.
//
// The inner box wraps its content instead of carrying fixed dimensions, so the
// emblem follows whatever title it is given. Its measured size feeds the ring
// scale factors, which is why it is observed rather than assumed.
export function ShockwaveWrapper({
    children,
    waves = 3,
    duration = 9,
    targetW,
    targetH,
    staticBorder = false,
    gap = 0,
    className,
}: ShockwaveWrapperProps) {
    const innerRef = useRef<HTMLDivElement>(null);
    const [inner, setInner] = useState({ w: 0, h: 0 });

    useEffect(() => {
        const el = innerRef.current;
        if (!el) return;

        const observer = new ResizeObserver(([entry]) => {
            // Border box, because the rings are positioned against that edge.
            const box = entry.borderBoxSize?.[0];
            setInner(
                box
                    ? { w: box.inlineSize, h: box.blockSize }
                    : {
                          w: entry.contentRect.width,
                          h: entry.contentRect.height,
                      },
            );
        });

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    // Stagger each ring evenly across the animation cycle via negative delays.
    const delays = Array.from(
        { length: waves },
        (_, i) => -(i * (duration / waves)),
    );

    // Until the first measurement arrives the box is still 0 wide, which would
    // scale the rings to infinity. Hold them still for that one frame.
    const measured = inner.w > 0 && inner.h > 0;
    const swX = measured ? targetW / (inner.w + 2 * gap) : 1;
    const swY = measured ? targetH / (inner.h + 2 * gap) : 1;
    const insetPx = { inset: -gap };

    const ringStyle = (delay: number): React.CSSProperties =>
        ({
            animation: `shockwave ${duration}s linear infinite ${delay}s`,
            "--sw-x": swX,
            "--sw-y": swY,
            ...insetPx,
        }) as React.CSSProperties;

    return (
        <div className={className} style={{ width: targetW, height: targetH }}>
            <div ref={innerRef} className="relative w-fit">
                {staticBorder && (
                    <div
                        className="pointer-events-none absolute border border-foreground"
                        style={insetPx}
                    />
                )}
                {delays.map((delay, i) => (
                    <div
                        key={i}
                        className="pointer-events-none absolute border border-foreground"
                        style={ringStyle(delay)}
                    />
                ))}
                {children}
            </div>
        </div>
    );
}
