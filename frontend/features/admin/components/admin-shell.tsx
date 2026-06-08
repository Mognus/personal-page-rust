"use client";

import { SidebarUser } from "@/features/auth/components/sidebar-user";
import { AdminNav } from "@/features/admin/components/admin-nav";
import { adminNavModels } from "@/features/admin/lib/resources";
import { SettingsPanel } from "@/features/settings/components/settings-panel";
import { SidebarBrand } from "@/features/sidebar/components/sidebar-brand";
import { SidebarToggle } from "@/features/sidebar/components/sidebar-toggle";
import { useSidebar } from "@/features/sidebar/store/sidebar";
import { cn } from "@/lib/utils";

// Admin shell: an "ADMIN" sidebar with the model nav + the shared user/settings
// footer, and a main area with a toggle. Reuses the public sidebar primitives.
export function AdminShell({ children }: { children: React.ReactNode }) {
    const { isOpen } = useSidebar();

    return (
        <div className="flex h-screen overflow-hidden">
            <aside
                className={cn(
                    "flex shrink-0 flex-col justify-between overflow-hidden border-r border-foreground/60 font-syne transition-[max-width,padding] duration-[600ms]",
                    isOpen ? "max-w-3xl" : "max-w-0",
                )}
            >
                <div className="flex flex-col">
                    <SidebarBrand
                        targetW={300}
                        targetH={150}
                        title="ADMIN"
                        href="/admin"
                        className="relative flex items-center justify-center rounded"
                    />
                    <div className="mx-5 mb-6 h-px w-1/2 bg-foreground" />
                    <AdminNav models={adminNavModels} />
                </div>
                <SidebarUser
                    className="border-t border-foreground/40 px-5 py-4"
                    centerWhenEmpty
                />
            </aside>
            <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden">
                <header className="flex items-center gap-4 border-b border-foreground/40 px-4 py-3">
                    <SidebarToggle />
                </header>
                <div className="relative min-h-0 flex-1 overflow-y-auto">
                    {children}
                </div>
                <SettingsPanel className="absolute right-0 bottom-0 z-50 min-w-48 border-t border-l border-foreground/60 bg-background p-4" />
            </main>
        </div>
    );
}
