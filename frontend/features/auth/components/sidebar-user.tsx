"use client";

import { UserDisplay } from "@/features/auth/components/user-display";
import { useUserStore } from "@/features/auth/store/user-store";
import { SettingsToggle } from "@/features/settings/components/settings-toggle";
import { cn } from "@/lib/utils";

// Sidebar footer row. The settings gear is always shown so logged-out visitors
// can still reach theme/language; the user info appears only when signed in.
// `centerWhenEmpty` centers the lone gear when signed out (desktop sidebar).
export function SidebarUser({
    className,
    centerWhenEmpty,
}: {
    className?: string;
    centerWhenEmpty?: boolean;
}) {
    const user = useUserStore((s) => s.user);

    return (
        <div
            className={cn(
                "flex items-center gap-2",
                !user && centerWhenEmpty ? "justify-center" : "justify-end",
                className,
            )}
        >
            {user && (
                <UserDisplay name={user.display_name} email={user.email} />
            )}
            <SettingsToggle />
        </div>
    );
}
