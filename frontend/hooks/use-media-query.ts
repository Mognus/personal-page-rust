"use client";

import { useLayoutEffect, useState } from "react";

export function useViewportSize(): { width: number; height: number } {
    const [size, setSize] = useState({ width: 0, height: 0 });

    useLayoutEffect(() => {
        const update = () => setSize({ width: window.innerWidth, height: window.innerHeight });
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    return size;
}

export function useMediaQuery(query: string, initialValue = false): boolean {
    const [matches, setMatches] = useState(initialValue);

    useLayoutEffect(() => {
        const mq = window.matchMedia(query);
        setMatches(mq.matches);
        const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, [query]);

    return matches;
}
