"use client";

import Image from "next/image";

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
    // The two mascots peeking out from behind the number. Off by default: the
    // admin shell reuses this component with its own title.
    mascots?: boolean;
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
    mascots = false,
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

            {/* One stands behind each digit of the number. The negative
                z-index is what sells it: the glyphs paint over the feet, so the
                two look like they are standing behind the number rather than on
                top of it. Offsets are measured from the bottom right of the
                box, which is where the number sits.
                unoptimized keeps the GIFs animating. */}
            {mascots && (
                <>
                    <Image
                        src="/tux-devil.gif"
                        alt=""
                        width={103}
                        height={100}
                        unoptimized
                        aria-hidden
                        className="pointer-events-none absolute -z-10 h-6 w-auto select-none"
                        style={{ right: 22, bottom: 14 }}
                    />
                    <Image
                        src="/tux-angel.gif"
                        alt=""
                        width={93}
                        height={100}
                        unoptimized
                        aria-hidden
                        className="pointer-events-none absolute -z-10 h-6 w-auto select-none"
                        style={{ right: 0, bottom: 14 }}
                    />
                </>
            )}
        </ShockwaveWrapper>
    );
}
