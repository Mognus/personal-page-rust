interface ShockwaveWrapperProps {
    children: React.ReactNode;
    waves?: number;
    duration?: number;
    innerW: number;
    innerH: number;
    targetW: number;
    targetH: number;
    staticBorder?: boolean;
    gap?: number;
    className?: string;
}

// Renders `waves` border rings that scale outward on a loop (the `shockwave`
// keyframes), scaled so each ring grows from the inner box to the target box.
export function ShockwaveWrapper({
    children,
    waves = 3,
    duration = 9,
    innerW,
    innerH,
    targetW,
    targetH,
    staticBorder = false,
    gap = 0,
    className,
}: ShockwaveWrapperProps) {
    // Stagger each ring evenly across the animation cycle via negative delays.
    const delays = Array.from({ length: waves }, (_, i) => -(i * (duration / waves)));
    const swX = targetW / (innerW + 2 * gap);
    const swY = targetH / (innerH + 2 * gap);
    const insetPx = { inset: -gap };

    const ringStyle = (delay: number): React.CSSProperties => ({
        animation: `shockwave ${duration}s linear infinite ${delay}s`,
        "--sw-x": swX,
        "--sw-y": swY,
        ...insetPx,
    } as React.CSSProperties);

    return (
        <div className={className} style={{ width: targetW, height: targetH }}>
            <div className="relative" style={{ width: innerW, height: innerH }}>
                {staticBorder && (
                    <div className="pointer-events-none absolute border border-foreground" style={insetPx} />
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
