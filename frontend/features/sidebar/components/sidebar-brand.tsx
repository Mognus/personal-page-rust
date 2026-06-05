"use client";

import { ShockwaveWrapper } from "@/features/sidebar/components/shockwave-wrapper";
import { SidebarTitle } from "@/features/sidebar/components/sidebar-title";

interface SidebarBrandProps {
    targetW: number;
    targetH: number;
    innerW?: number;
    innerH?: number;
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
    innerW = 195.6,
    innerH = 55,
    waves,
    duration,
    gap,
    staticBorder,
    className = "relative flex items-center justify-center",
    title = "FREIER\nFREIER23",
    href = "/",
    titleClassName,
}: SidebarBrandProps) {
    return (
        <ShockwaveWrapper
            innerW={innerW}
            innerH={innerH}
            targetW={targetW}
            targetH={targetH}
            waves={waves}
            duration={duration}
            gap={gap}
            staticBorder={staticBorder}
            className={className}
        >
            <SidebarTitle title={title} href={href} className={titleClassName} />
        </ShockwaveWrapper>
    );
}
