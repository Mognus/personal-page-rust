"use client";

import type { ReactNode } from "react";

import { ConfigFileList } from "@/features/setup/components/config-file-list";
import { BREAKPOINTS } from "@/features/sidebar/lib/breakpoints";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { GithubEntry } from "@/lib/github";
import { cn } from "@/lib/utils";

interface ConfigCardProps {
    slug: string;
    configPath: string;
    files: GithubEntry[];
    children: ReactNode;
}

// Splits the open config into a file selector + a content area. Desktop puts the
// selector on the left (sized to content); mobile stacks it as a bottom strip.
export function ConfigCard({
    slug,
    configPath,
    files,
    children,
}: ConfigCardProps) {
    const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`);

    return (
        <div
            className={cn(
                "flex min-h-0 flex-1 bg-background",
                isMobile ? "flex-col-reverse" : "flex-row",
            )}
        >
            <div
                className={cn(
                    "min-h-0 shrink-0 border-foreground/40",
                    isMobile
                        ? "basis-[20%] overflow-visible border-t pt-4"
                        : "w-fit max-w-[24rem] min-w-[14rem] overflow-hidden border-r",
                )}
            >
                <ConfigFileList
                    slug={slug}
                    configPath={configPath}
                    files={files}
                />
            </div>
            <div
                className={cn(
                    "min-h-0 overflow-y-auto p-4",
                    isMobile ? "basis-[80%]" : "min-w-0 flex-1",
                )}
            >
                {children}
            </div>
        </div>
    );
}
