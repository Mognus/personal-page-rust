import { NavSidebarLinks } from "@/features/sidebar/components/nav-sidebar-links";
import { SidebarBrand } from "@/features/sidebar/components/sidebar-brand";
import { links } from "@/features/sidebar/lib/links";
import { cn } from "@/lib/utils";

// Content-driven sidebar: the aside shrinks to its widest child (the brand),
// so the divider and links line up against that width. `isOpen` collapses it
// to zero width (overflow clipped) for the toggle.
export function AppSidebar({ isOpen }: { isOpen: boolean }) {
    return (
        <aside className={cn("sidebar-nav flex flex-col", isOpen ? "max-w-3xl" : "max-w-0")}>
            <SidebarBrand
                targetW={300}
                targetH={150}
                className="relative flex items-center justify-center rounded"
            />
            <div className="sidebar-divider mx-5 mb-6" />
            <NavSidebarLinks
                items={links}
                className="flex flex-col gap-5 px-5"
                itemClassName="sidebar-nav-links-item ml-2 flex flex-col gap-1"
                linkClassName="sidebar-nav-links-link"
                underlineClassName="sidebar-nav-links-underline"
            />
        </aside>
    );
}
