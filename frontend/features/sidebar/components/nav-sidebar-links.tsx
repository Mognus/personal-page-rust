"use client";

import type { NavLink } from "@/features/sidebar/lib/links";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavSidebarLinksProps {
    items: NavLink[];
    // Optional layout tweaks for the nav container (e.g. px-5 / ml-2 on desktop).
    // The link/underline look is baked in — it's the same in every context.
    className?: string;
}

export function NavSidebarLinks({ items, className }: NavSidebarLinksProps) {
    const pathname = usePathname();

    return (
        <nav className={cn("flex min-w-0 flex-col gap-5", className)}>
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    // group/peer drive the underline: it grows on hover (group)
                    // and on the active link (peer-data-[active]) — no custom CSS.
                    <div
                        key={item.href}
                        className="group flex min-w-0 flex-col gap-1"
                    >
                        <Link
                            href={item.href}
                            data-active={isActive || undefined}
                            className="peer text-lg font-semibold tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-foreground data-[active]:text-foreground"
                        >
                            {item.label}
                        </Link>
                        <div className="h-px w-0 bg-foreground transition-[width] duration-300 group-hover:w-1/4 peer-data-[active]:w-1/4" />
                    </div>
                );
            })}
        </nav>
    );
}
