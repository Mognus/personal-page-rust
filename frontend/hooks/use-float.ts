"use client";

import { useCallback } from "react";

// Returns a factory for a two-axis float animation: the outer element drifts on
// x, the inner on y (slightly slower) so the motion never looks mechanical.
// Amplitude/timing are passed per element; CSS vars feed the float-x/float-y
// keyframes in globals.css.
export function useFloat() {
    return useCallback(
        (duration = 4, delay = 0, x = 5, y = -7) => ({
            outer: {
                "--float-x": `${x}px`,
                animation: `float-x ${duration}s ease-in-out infinite ${delay}s`,
            } as React.CSSProperties,
            inner: {
                "--float-y": `${y}px`,
                animation: `float-y ${(duration * 1.4).toFixed(1)}s ease-in-out infinite ${delay}s`,
            } as React.CSSProperties,
        }),
        [],
    );
}
