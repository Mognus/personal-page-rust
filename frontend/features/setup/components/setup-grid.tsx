"use client";

import type { ReactNode } from "react";
import { useSelectedLayoutSegment } from "next/navigation";

import { FloatWrapper } from "@/components/float-wrapper";
import { ConfigButton } from "@/features/setup/components/config-button";
import type { Config } from "@/features/setup/lib/configs";
import {
    getColumnCount,
    getDefaultTracks,
    getExpandedTracks,
    getRowCount,
} from "@/features/setup/lib/grid";
import { useFloat } from "@/hooks/use-float";
import { useViewportSize } from "@/hooks/use-media-query";

interface SetupGridProps {
    configs: Config[];
    children?: ReactNode;
}

// Morphing grid of config buttons. The active route segment ([config]) drives
// the expansion: its cell grows to fill the grid (the file view renders inside)
// while every other track collapses to 0fr.
export function SetupGrid({ configs, children }: SetupGridProps) {
    const { width } = useViewportSize();
    const float = useFloat();
    const selectedSegment = useSelectedLayoutSegment();

    const activeIndex = configs.findIndex(
        (config) => config.slug === selectedSegment,
    );
    const isExpanded = activeIndex >= 0;
    const columnCount = getColumnCount(width);
    const rowCount = getRowCount(configs.length, columnCount);
    const gridStyle = isExpanded
        ? getExpandedTracks(activeIndex, columnCount, rowCount)
        : getDefaultTracks(columnCount, rowCount);

    return (
        <div
            className="grid h-full min-h-0 p-8 transition-[grid-template-columns,grid-template-rows,gap] duration-500 ease-in-out [&>*]:min-h-0 [&>*]:min-w-0"
            style={gridStyle}
        >
            {configs.map((config, index) => (
                <div
                    key={config.slug}
                    className="relative min-h-0 overflow-hidden"
                >
                    {activeIndex === index && children ? (
                        <div className="h-full min-h-0 overflow-hidden bg-background">
                            {children}
                        </div>
                    ) : (
                        <FloatWrapper
                            float={float(5 + index * 0.15, index * -0.2, 3, -4)}
                            // p-2 buffer so the floating corners never reach the
                            // cell's overflow-hidden edge and get clipped.
                            className="h-full min-h-0 p-2"
                            innerClassName="h-full min-h-0"
                        >
                            <ConfigButton
                                slug={config.slug}
                                label={config.label}
                                icon={config.icon}
                                className="gap-2 p-2 min-[720px]:gap-3 min-[1080px]:gap-4"
                                iconClassName="size-8 min-[720px]:size-9 min-[1080px]:size-10"
                                textClassName="!text-xs min-[720px]:!text-sm min-[1080px]:!text-lg"
                            />
                        </FloatWrapper>
                    )}
                </div>
            ))}
        </div>
    );
}
