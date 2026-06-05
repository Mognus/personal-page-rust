"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";

// Light/dark toggle. The icon is driven by the `dark` class via CSS (no JS theme
// read at render → no hydration mismatch, no mounted guard, no effect).
export function ThemeToggle({ className }: { className?: string }) {
    const { resolvedTheme, setTheme } = useTheme();

    function toggle() {
        const next = resolvedTheme === "dark" ? "light" : "dark";

        // Smooth cross-fade via the View Transitions API. flushSync forces the
        // theme class onto <html> inside the transition so it's captured;
        // instant fallback where the API is unavailable.
        if (!document.startViewTransition) {
            setTheme(next);
            return;
        }
        document.startViewTransition(() => flushSync(() => setTheme(next)));
    }

    return (
        <button
            onClick={toggle}
            aria-label="Toggle theme"
            className={
                className ??
                "cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            }
        >
            <Sun className="hidden h-4 w-4 dark:block" />
            <Moon className="h-4 w-4 dark:hidden" />
        </button>
    );
}
