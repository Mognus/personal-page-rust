import { NavSidebarLinks } from "@/features/sidebar/components/nav-sidebar-links";
import { SidebarBrand } from "@/features/sidebar/components/sidebar-brand";
import { links } from "@/features/sidebar/lib/links";

// Content-driven sidebar: the aside shrinks to its widest child (the brand),
// so the divider and links line up against that width.
export function AppSidebar() {
    return (
        <aside className="sidebar-nav flex flex-col">
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
