"use client";

import type { ReactNode } from "react";

import { DesktopConfigCard } from "@/features/setup/components/desktop-config-card";
import { MobileConfigCard } from "@/features/setup/components/mobile-config-card";
import { BREAKPOINTS } from "@/features/sidebar/lib/breakpoints";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { GithubEntry } from "@/lib/github";

interface ConfigCardProps {
    slug: string;
    configPath: string;
    files: GithubEntry[];
    children: ReactNode;
}

// Splits the open config into a file selector + a content area. Desktop and
// mobile layouts differ enough that each owns its own self-contained file.
export function ConfigCard({
    slug,
    configPath,
    files,
    children,
}: ConfigCardProps) {
    const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`);

    if (isMobile) {
        return (
            <MobileConfigCard
                slug={slug}
                configPath={configPath}
                files={files}
            >
                {children}
            </MobileConfigCard>
        );
    }

    return (
        <DesktopConfigCard slug={slug} configPath={configPath} files={files}>
            {children}
        </DesktopConfigCard>
    );
}
