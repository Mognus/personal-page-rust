"use client";

import { UserDisplay } from "@/features/auth/components/user-display";
import { useUserStore } from "@/features/auth/store/user-store";
import { SettingsToggle } from "@/features/settings/components/settings-toggle";
import { cn } from "@/lib/utils";

// User section (display + menu). Layout-neutral; the caller supplies contextual
// spacing/borders via className. Renders nothing when signed out.
export function SidebarUser({ className }: { className?: string }) {
    const user = useUserStore((s) => s.user);
    if (!user) return null;

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <UserDisplay name={user.display_name} email={user.email} />
            <SettingsToggle />
        </div>
    );
}
