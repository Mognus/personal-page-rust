"use client";

import { useLocale } from "next-intl";

import { Link, usePathname } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// Switches locale by linking to the current pathname under another locale.
export function LanguageSwitcher({ className }: { className?: string }) {
    const locale = useLocale();
    const pathname = usePathname();

    return (
        <div className={cn("flex items-center gap-2", className)}>
            {routing.locales.map((loc) => (
                <Link
                    key={loc}
                    href={pathname}
                    locale={loc}
                    aria-pressed={loc === locale}
                    className={cn(
                        "tracking-widest text-muted-foreground uppercase transition-colors hover:text-foreground",
                        loc === locale && "text-foreground",
                    )}
                >
                    {loc.toUpperCase()}
                </Link>
            ))}
        </div>
    );
}
