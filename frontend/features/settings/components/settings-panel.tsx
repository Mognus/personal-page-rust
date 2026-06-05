"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Text } from "@/components/typography/text";
import { logoutAction } from "@/features/auth/actions";
import { useUserStore } from "@/features/auth/store/user-store";
import { useSettingsPanel } from "@/features/settings/store/settings-panel";
import { cn } from "@/lib/utils";

// Settings box. Layout-neutral; the caller positions it (desktop: bottom-right
// of the content, mobile: under the user). Theme + language toggles land here
// next; for now it holds logout.
export function SettingsPanel({ className }: { className?: string }) {
    const { isOpen, close } = useSettingsPanel();
    const setUser = useUserStore((s) => s.setUser);
    const router = useRouter();

    if (!isOpen) return null;

    async function handleLogout() {
        close();
        await logoutAction();
        setUser(null);
        toast.success("Signed out.");
        router.push("/login");
        router.refresh();
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <Text as="span" variant="eyebrowMuted">
                Settings
            </Text>

            {/* Theme + language toggles go here next (roadmap #3). */}

            <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
            >
                <LogOut className="h-4 w-4" />
                <Text as="span" variant="eyebrowMuted">
                    Sign out
                </Text>
            </button>
        </div>
    );
}
