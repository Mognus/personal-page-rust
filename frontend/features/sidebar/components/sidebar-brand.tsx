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

            {/* One rises behind each digit of the number. Each sits in a box
                clipped at the top edge of the digits, so sliding past the
                bottom hides it completely. A z-index would not be enough: the
                glyphs are outlines, and anything sunk behind them would still
                show through the counters of the 2 and the 3.

                Offsets are measured from the bottom right of the box, which is
                where the number sits; the box dimensions match the rendered GIF
                so nothing sticks out sideways. Each has its own keyframes: they
                appear alone in turn and meet once per cycle.
                unoptimized keeps them animating. */}
            {mascots && (
                <>
                    <span
                        aria-hidden
                        className="pointer-events-none absolute -z-10 overflow-hidden"
                        style={{ right: 22, bottom: 14, width: 25, height: 24 }}
                    >
                        <Image
                            src="/tux-devil.gif"
                            alt=""
                            width={103}
                            height={100}
                            unoptimized
                            className="mascot-peek-devil h-6 w-auto select-none"
                        />
                    </span>
                    <span
                        aria-hidden
                        className="pointer-events-none absolute -z-10 overflow-hidden"
                        style={{ right: 0, bottom: 14, width: 22, height: 24 }}
                    >
                        {/* Two elements, because the rocking is a transform as
                            well and one element runs only one animation per
                            property: the outer one lifts, the inner one frets. */}
                        <span className="mascot-peek-angel block">
                            <Image
                                src="/tux-angel.gif"
                                alt=""
                                width={93}
                                height={100}
                                unoptimized
                                className="mascot-fret h-6 w-auto select-none"
                            />
                        </span>
                    </span>
                </>
            )}
        </ShockwaveWrapper>
    );
}
