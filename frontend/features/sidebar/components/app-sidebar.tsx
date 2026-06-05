import { SidebarUser } from "@/features/auth/components/sidebar-user";
import { NavSidebarLinks } from "@/features/sidebar/components/nav-sidebar-links";
import { SidebarBrand } from "@/features/sidebar/components/sidebar-brand";
import { links } from "@/features/sidebar/lib/links";
import { cn } from "@/lib/utils";

// Content-driven sidebar: the aside shrinks to its widest child (the brand),
// so the divider and links line up against that width. `isOpen` collapses it
// to zero width (overflow clipped) for the toggle. justify-between pushes the
// user section to the bottom.
export function AppSidebar({ isOpen }: { isOpen: boolean }) {
    return (
        <aside
            className={cn(
                "flex shrink-0 flex-col justify-between overflow-hidden border-r border-foreground/60 font-syne transition-[max-width,padding] duration-[600ms]",
                isOpen ? "max-w-3xl" : "max-w-0",
            )}
        >
            <div className="flex flex-col">
                <SidebarBrand
                    targetW={300}
                    targetH={150}
                    className="relative flex items-center justify-center rounded"
                />
                <div className="mx-5 mb-6 h-px w-1/2 bg-foreground" />
                <NavSidebarLinks items={links} className="ml-2 px-5" />
            </div>
            <SidebarUser className="border-t border-foreground/40 px-5 py-4" />
        </aside>
    );
}
