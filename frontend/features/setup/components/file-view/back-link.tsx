"use client";

import { ArrowDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Returns to the config grid (collapses the morphed cell back).
export function BackLink({ className }: { className?: string }) {
    const t = useTranslations("Setup");

    return (
        <Link
            href="/personal-setup"
            aria-label={t("back")}
            className={cn(
                "inline-flex items-center justify-center text-muted-foreground/80 transition-colors hover:text-foreground",
                className,
            )}
        >
            <ArrowDown />
        </Link>
    );
}
