"use client";

import { useEffect } from "react";

import { SidebarUser } from "@/features/auth/components/sidebar-user";
import { SettingsPanel } from "@/features/settings/components/settings-panel";
import { Breadcrumbs } from "@/features/sidebar/components/breadcrumbs";
import { NavSidebarLinks } from "@/features/sidebar/components/nav-sidebar-links";
import { SidebarBrand } from "@/features/sidebar/components/sidebar-brand";
import { SidebarToggle } from "@/features/sidebar/components/sidebar-toggle";
import { SocialBar } from "@/features/sidebar/components/social-bar";
import { links } from "@/features/sidebar/lib/links";
import { SOCIALS } from "@/features/sidebar/lib/socials";
import { useSidebar } from "@/features/sidebar/store/sidebar";
import { useViewportSize } from "@/hooks/use-media-query";

export function MobileShell({ children }: { children: React.ReactNode }) {
    const { isOpen, setOpen } = useSidebar();
    const { width } = useViewportSize();

    // The sidebar starts collapsed on mobile; the bottom toggle opens it.
    useEffect(() => {
        setOpen(false);
    }, [setOpen]);

    return (
        <div className="relative flex h-screen flex-col font-mono">
            <header className="flex border-b border-foreground/40 px-4 py-3">
                <Breadcrumbs />
            </header>
            <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-40 bg-background/90" />
                    {/* Brand spans the top, sized to the viewport. */}
                    <div className="fixed top-0 left-1/2 z-50 -translate-x-1/2">
                        <SidebarBrand
                            targetW={width}
                            targetH={width / 2}
                            waves={1}
                            duration={3}
                            gap={10}
                            staticBorder
                        />
                    </div>
                    {/* Top-anchored so the gear hangs under the last nav item
                        and the settings panel drops down below it. */}
                    <div className="fixed top-1/2 left-[5vw] z-50 flex flex-col gap-6">
                        <NavSidebarLinks items={links} />
                        <div className="flex flex-col gap-3">
                            <SidebarUser align="start" />
                            <SettingsPanel className="border-l border-foreground/40 pl-3" />
                        </div>
                    </div>
                    <div className="fixed top-2/3 right-[5vw] z-50 -translate-y-1/2">
                        <SocialBar
                            socials={SOCIALS}
                            className="flex shrink-0 flex-col items-center justify-center gap-6"
                        />
                    </div>
                </>
            )}

            {/* Fixed open/close toggle, bottom-left. */}
            <div className="fixed bottom-6 left-6 z-50">
                <SidebarToggle className="cursor-pointer text-3xl text-muted-foreground transition-colors hover:text-foreground" />
            </div>
        </div>
    );
}
