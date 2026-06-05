"use client";

import { AppSidebar } from "@/features/sidebar/components/app-sidebar";
import { SidebarToggle } from "@/features/sidebar/components/sidebar-toggle";
import { SocialBar } from "@/features/sidebar/components/social-bar";
import { SOCIALS } from "@/features/sidebar/lib/socials";
import { useSidebar } from "@/features/sidebar/store/sidebar";

// Wires the shared open/closed state to the sidebar, toggle and social rail.
// Children stay server-rendered — only this shell reads the store.
export function AppShell({ children }: { children: React.ReactNode }) {
    const { isOpen } = useSidebar();

    return (
        <div className="flex h-screen overflow-hidden">
            <AppSidebar isOpen={isOpen} />
            {/* relative so a full-bleed child (e.g. the home cube) can fill it. */}
            <main className="relative min-w-0 flex-1 overflow-hidden">
                <SidebarToggle className="absolute left-3 top-3 z-10 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
                {children}
            </main>
            <SocialBar
                socials={SOCIALS}
                isOpen={isOpen}
                className="sidebar-social flex flex-col items-center justify-center gap-6"
            />
        </div>
    );
}
