"use client";

import { LogOut } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { toast } from "sonner";

import { Text } from "@/components/typography/text";
import { logoutAction } from "@/features/auth/actions";
import { useUserStore } from "@/features/auth/store/user-store";
import { LanguageSwitcher } from "@/features/settings/components/language-switcher";
import { ThemeToggle } from "@/features/settings/components/theme-toggle";
import { useSettingsPanel } from "@/features/settings/store/settings-panel";
import { cn } from "@/lib/utils";

// Settings box. Layout-neutral; the caller positions it (desktop: bottom-right
// of the content, mobile: under the user). Theme + language toggles land here
// next; for now it holds logout.
export function SettingsPanel({ className }: { className?: string }) {
    const { isOpen, close } = useSettingsPanel();
    const user = useUserStore((s) => s.user);
    const setUser = useUserStore((s) => s.setUser);
    const router = useRouter();
    const t = useTranslations("Settings");

    if (!isOpen) return null;

    async function handleLogout() {
        close();
        await logoutAction();
        setUser(null);
        toast.success(t("signedOut"));
        router.push("/login");
        router.refresh();
    }

    return (
        <div className={cn("flex flex-col gap-3", className)}>
            <Text as="span" variant="eyebrowMuted">
                {t("title")}
            </Text>

            <div className="flex items-center justify-between gap-4">
                <Text as="span" variant="eyebrowMuted">
                    {t("theme")}
                </Text>
                <ThemeToggle />
            </div>

            <div className="flex items-center justify-between gap-4">
                <Text as="span" variant="eyebrowMuted">
                    {t("language")}
                </Text>
                <LanguageSwitcher />
            </div>

            {user && (
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
                >
                    <LogOut className="h-4 w-4" />
                    <Text as="span" variant="eyebrowMuted">
                        {t("signOut")}
                    </Text>
                </button>
            )}
        </div>
    );
}

// Label-free variant for tight spots (mobile): just the theme icon and the
// language switch, which are self-explanatory. Shares the open/close state with
// SettingsPanel above.
export function SettingsPanelCompact({ className }: { className?: string }) {
    const { isOpen } = useSettingsPanel();

    if (!isOpen) return null;

    return (
        <div className={cn("flex flex-col items-start gap-3", className)}>
            <ThemeToggle />
            <LanguageSwitcher />
        </div>
    );
}
