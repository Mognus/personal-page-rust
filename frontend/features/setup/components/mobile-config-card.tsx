"use client";

import { useState, type ReactNode } from "react";

import { MobileFileSelector } from "@/features/setup/components/mobile-file-selector";
import { usePathname } from "@/i18n/navigation";
import type { GithubEntry } from "@/lib/github";

interface MobileConfigCardProps {
    slug: string;
    configPath: string;
    files: GithubEntry[];
    children: ReactNode;
}

// Mobile: content over a bottom selector cell. Opening morphs the grid rows
// (same technique as the setup grid) so the selector grows from a button-sized
// strip to half the height while the content shrinks.
export function MobileConfigCard({
    slug,
    configPath,
    files,
    children,
}: MobileConfigCardProps) {
    const [open, setOpen] = useState(false);

    // Picking a file changes the route — collapse so the content shows.
    const pathname = usePathname();
    const [prevPathname, setPrevPathname] = useState(pathname);
    if (pathname !== prevPathname) {
        setPrevPathname(pathname);
        setOpen(false);
    }

    return (
        <div
            className="grid h-full min-h-0 bg-background transition-[grid-template-rows] duration-500 ease-in-out"
            style={{ gridTemplateRows: open ? "1fr 1fr" : "9fr 1fr" }}
        >
            <div className="min-h-0 overflow-y-auto p-4">{children}</div>
            <MobileFileSelector
                slug={slug}
                configPath={configPath}
                files={files}
                open={open}
                onToggle={() => setOpen((v) => !v)}
            />
        </div>
    );
}
