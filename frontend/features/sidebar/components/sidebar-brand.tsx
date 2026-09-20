"use client";

import { ShockwaveWrapper } from "@/features/sidebar/components/shockwave-wrapper";
import { SidebarTitle } from "@/features/sidebar/components/sidebar-title";

interface SidebarBrandProps {
    targetW: number;
    targetH: number;
    waves?: number;
    duration?: number;
    gap?: number;
    staticBorder?: boolean;
    className?: string;
    title?: string;
    href?: string;
    titleClassName?: string;
}

export function SidebarBrand({
    targetW,
    targetH,
    waves,
    duration,
    // The box hugs the title, so without a gap the innermost ring would sit
    // right against the letters.
    gap = 5,
    staticBorder,
    className = "relative flex items-center justify-center",
    title = "LUX\nXER 23",
    href = "/",
    titleClassName,
}: SidebarBrandProps) {
    return (
        <ShockwaveWrapper
            targetW={targetW}
            targetH={targetH}
            waves={waves}
            duration={duration}
            gap={gap}
            staticBorder={staticBorder}
            className={className}
        >
            <SidebarTitle
                title={title}
                href={href}
                className={titleClassName}
            />
        </ShockwaveWrapper>
    );
}
