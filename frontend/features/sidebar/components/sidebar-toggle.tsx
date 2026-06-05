"use client";

import { Menu, X } from "lucide-react";

import { useSidebar } from "@/features/sidebar/store/sidebar";

export function SidebarToggle({ className }: { className?: string }) {
    const { isOpen, toggle } = useSidebar();

    return (
        <button
            onClick={toggle}
            aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
            className={className ?? "cursor-pointer text-muted-foreground transition-colors hover:text-foreground"}
        >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
    );
}
