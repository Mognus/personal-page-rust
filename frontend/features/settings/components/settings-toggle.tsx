"use client";

import { Settings, X } from "lucide-react";

import { useSettingsPanel } from "@/features/settings/store/settings-panel";

// Gear/X button that toggles the settings panel.
export function SettingsToggle({ className }: { className?: string }) {
    const { isOpen, toggle } = useSettingsPanel();

    return (
        <button
            onClick={toggle}
            aria-label={isOpen ? "Close settings" : "Open settings"}
            className={
                className ??
                "shrink-0 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            }
        >
            {isOpen ? (
                <X className="h-4 w-4" />
            ) : (
                <Settings className="h-4 w-4" />
            )}
        </button>
    );
}
