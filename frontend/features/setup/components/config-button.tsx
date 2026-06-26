"use client";

import {
    Bell,
    Code2,
    Layers,
    Monitor,
    Package,
    PanelTop,
    SquareTerminal,
    Terminal,
    type LucideIcon,
} from "lucide-react";

import { CornerFrame } from "@/components/corner-frame";
import { Text } from "@/components/typography/text";
import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

// Maps the icon name stored in the DB to a lucide component. Unknown names fall
// back to Package, so adding a config never breaks the grid.
const ICON_MAP: Record<string, LucideIcon> = {
    Bell,
    Code2,
    Layers,
    Monitor,
    Package,
    PanelTop,
    SquareTerminal,
    Terminal,
};

interface ConfigButtonProps {
    slug: string;
    label: string;
    icon: string;
    className?: string;
    iconClassName?: string;
    textClassName?: string;
}

export function ConfigButton({
    slug,
    label,
    icon,
    className,
    iconClassName,
    textClassName,
}: ConfigButtonProps) {
    const Icon = ICON_MAP[icon] ?? Package;

    return (
        <Link href={`/personal-setup/${slug}`} className="block h-full w-full">
            <CornerFrame
                className={cn(
                    "flex h-full w-full flex-col items-center justify-center gap-3 bg-foreground/5 p-4 transition-colors hover:bg-foreground/10",
                    className,
                )}
            >
                <Icon
                    className={cn("size-7 shrink-0", iconClassName)}
                    strokeWidth={1.5}
                />
                <Text
                    as="span"
                    variant="eyebrow"
                    className={cn("font-mono", textClassName)}
                >
                    {label}
                </Text>
            </CornerFrame>
        </Link>
    );
}
