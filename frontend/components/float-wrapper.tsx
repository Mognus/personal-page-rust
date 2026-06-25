export interface FloatAnimation {
    outer: React.CSSProperties;
    inner: React.CSSProperties;
}

interface FloatWrapperProps {
    float: FloatAnimation;
    className?: string;
    innerClassName?: string;
    children: React.ReactNode;
}

// Two nested elements so the x (outer) and y (inner) drifts compose. Pair with
// useFloat for the animation values.
export function FloatWrapper({
    float,
    className,
    innerClassName,
    children,
}: FloatWrapperProps) {
    return (
        <div className={className} style={float.outer}>
            <div className={innerClassName} style={float.inner}>
                {children}
            </div>
        </div>
    );
}
