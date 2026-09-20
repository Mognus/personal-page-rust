"use client";

import { useTranslations } from "next-intl";

import type { NavGroup, NavLink } from "@/features/sidebar/lib/links";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavSidebarLinksProps {
    groups: NavGroup[];
    // Optional layout tweaks for the nav container (e.g. px-5 / ml-2 on desktop).
    // The link/underline look is baked in — it's the same in every context.
    className?: string;
}

export function NavSidebarLinks({ groups, className }: NavSidebarLinksProps) {
    return (
        <nav className={cn("flex min-w-0 flex-col gap-8", className)}>
            {groups.map((group) => (
                <div key={group.href} className="flex min-w-0 flex-col gap-5">
                    <NavItem item={group} />

                    {group.children && group.children.length > 0 && (
                        // The rule is the group bracket: it runs down the left
                        // of the children, which is what marks them as nested.
                        <div className="flex min-w-0 flex-col gap-5 border-l border-foreground/30 pl-4">
                            {group.children.map((child) => (
                                <NavItem key={child.href} item={child} />
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}

function NavItem({ item }: { item: NavLink }) {
    const pathname = usePathname();
    const t = useTranslations("Nav");
    const isActive = pathname === item.href;

    return (
        // group/peer drive the underline: it grows on hover (group) and on the
        // active link (peer-data-[active]) — no custom CSS.
        <div className="group flex min-w-0 flex-col gap-1">
            <Link
                href={item.href}
                data-active={isActive || undefined}
                className="peer text-lg font-semibold tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-foreground data-[active]:text-foreground"
            >
                {t(item.labelKey)}
            </Link>
            <div className="h-px w-0 bg-foreground transition-[width] duration-300 group-hover:w-1/4 peer-data-[active]:w-1/4" />
        </div>
    );
}
