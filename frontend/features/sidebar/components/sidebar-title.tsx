import Link from "next/link";

import { cn } from "@/lib/utils";

interface SidebarTitleProps {
    title: string;
    href?: string;
    className?: string;
}

export function SidebarTitle({ title, href = "/", className }: SidebarTitleProps) {
    return (
        <Link href={href} className={cn("sidebar-title font-syne", className)}>
            {title}
        </Link>
    );
}
