import { Link } from "@/i18n/navigation";

import { cn } from "@/lib/utils";

interface SidebarTitleProps {
    title: string;
    href?: string;
    className?: string;
}

export function SidebarTitle({
    title,
    href = "/",
    className,
}: SidebarTitleProps) {
    return (
        <Link
            href={href}
            // whitespace-pre-line keeps the "\n" in the title as a line break.
            className={cn(
                "font-syne text-2xl leading-none font-black tracking-tight whitespace-pre-line text-foreground uppercase transition-colors hover:text-muted-foreground",
                className,
            )}
        >
            {title}
        </Link>
    );
}
