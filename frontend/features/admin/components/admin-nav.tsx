"use client";

import type { AdminModel } from "@/features/admin/lib/types";
import { Link, usePathname } from "@/i18n/navigation";

export function AdminNav({ models }: { models: AdminModel[] }) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-5 px-5">
            {models.map((model) => {
                const href = `/admin/models/${model.name}`;
                const isActive =
                    pathname === href || pathname.startsWith(`${href}/`);
                return (
                    <div
                        key={model.name}
                        className="group ml-2 flex flex-col gap-1"
                    >
                        <Link
                            href={href}
                            data-active={isActive || undefined}
                            className="peer text-lg font-semibold tracking-[0.15em] text-muted-foreground uppercase transition-colors hover:text-foreground data-[active]:text-foreground"
                        >
                            {model.displayName}
                        </Link>
                        <div className="h-px w-0 bg-foreground transition-[width] duration-300 group-hover:w-1/4 peer-data-[active]:w-1/4" />
                    </div>
                );
            })}
        </nav>
    );
}
