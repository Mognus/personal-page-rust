"use client";

import { SettingsPanel } from "@/features/settings/components/settings-panel";
import { AppSidebar } from "@/features/sidebar/components/app-sidebar";
import { Header } from "@/features/sidebar/components/header";
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
            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                <Header />
                {/* relative so a full-bleed child (e.g. the home cube) can fill it. */}
                <div className="relative min-h-0 flex-1 overflow-y-auto">
                    {children}
                </div>
                {/* Floats bottom-left of the content when open. */}
                <SettingsPanel className="absolute bottom-0 left-0 z-50 min-w-48 border-t border-r border-foreground/60 bg-background p-4" />
            </main>
            <SocialBar
                socials={SOCIALS}
                isOpen={isOpen}
                className="flex shrink-0 flex-col items-center justify-center gap-6 overflow-hidden border-l border-foreground/60 transition-[max-width,padding] duration-[600ms]"
            />
        </div>
    );
}
