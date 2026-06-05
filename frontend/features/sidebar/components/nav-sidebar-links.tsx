"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { NavLink } from "@/features/sidebar/lib/links";

interface NavSidebarLinksProps {
    items: NavLink[];
    className?: string;
    itemClassName?: string;
    linkClassName?: string;
    underlineClassName?: string;
}

export function NavSidebarLinks({
    items,
    className,
    itemClassName,
    linkClassName,
    underlineClassName,
}: NavSidebarLinksProps) {
    const pathname = usePathname();

    return (
        <nav className={className}>
            {items.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <div key={item.href} className={itemClassName}>
                        <Link href={item.href} data-active={isActive || undefined} className={linkClassName}>
                            {item.label}
                        </Link>
                        <div className={underlineClassName} />
                    </div>
                );
            })}
        </nav>
    );
}
