"use client";

import { useEffect } from "react";

import { AppShell } from "@/features/sidebar/components/app-shell";
import { MobileShell } from "@/features/sidebar/components/mobile-shell";
import { BREAKPOINTS } from "@/features/sidebar/lib/breakpoints";
import { VIEWPORT_COOKIE } from "@/features/sidebar/lib/cookies";
import { useMediaQuery } from "@/hooks/use-media-query";

interface ResponsiveShellProps {
    children: React.ReactNode;
    // Server-provided hint (from the viewport cookie) used as the initial value
    // so the first client render matches the server and doesn't flash.
    initialIsMobile: boolean;
}

export function ResponsiveShell({
    children,
    initialIsMobile,
}: ResponsiveShellProps) {
    const isMobile = useMediaQuery(
        `(max-width: ${BREAKPOINTS.mobile}px)`,
        initialIsMobile,
    );

    // Persist the current viewport so the next SSR can pick the right shell.
    useEffect(() => {
        document.cookie = `${VIEWPORT_COOKIE}=${isMobile ? "mobile" : "desktop"}; path=/; max-age=31536000`;
    }, [isMobile]);

    if (isMobile) return <MobileShell>{children}</MobileShell>;
    return <AppShell>{children}</AppShell>;
}
