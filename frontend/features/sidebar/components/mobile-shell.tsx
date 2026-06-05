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
                    <div className="fixed top-7/12 left-[5vw] z-50 flex -translate-y-1/2 flex-col">
                        <NavSidebarLinks items={links} />
                    </div>
                    {/* User pinned near the bottom (above the toggle). The group is
                        bottom-anchored, so the panel opens upward above the user. */}
                    <div className="fixed bottom-18 left-[5vw] z-50 flex flex-col">
                        <SettingsPanel className="mb-4 border-l border-foreground/40 pl-3" />
                        <SidebarUser />
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
