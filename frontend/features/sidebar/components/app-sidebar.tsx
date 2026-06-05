import { NavSidebarLinks } from "@/features/sidebar/components/nav-sidebar-links";
import { SidebarBrand } from "@/features/sidebar/components/sidebar-brand";
import { links } from "@/features/sidebar/lib/links";
import { cn } from "@/lib/utils";

// Content-driven sidebar: the aside shrinks to its widest child (the brand),
// so the divider and links line up against that width. `isOpen` collapses it
// to zero width (overflow clipped) for the toggle.
export function AppSidebar({ isOpen }: { isOpen: boolean }) {
    return (
        <aside
            className={cn(
                "flex shrink-0 flex-col overflow-hidden border-r border-foreground/60 font-syne transition-[max-width,padding] duration-[600ms]",
                isOpen ? "max-w-3xl" : "max-w-0",
            )}
        >
            <SidebarBrand
                targetW={300}
                targetH={150}
                className="relative flex items-center justify-center rounded"
            />
            <div className="mx-5 mb-6 h-px w-1/2 bg-foreground" />
            {/* group/peer drive the underline: it grows on hover (group) and on
                the active link (peer-data-[active]) — no custom CSS needed. */}
            <NavSidebarLinks
                items={links}
                className="flex flex-col gap-5 px-5"
                itemClassName="group ml-2 flex flex-col gap-1"
                linkClassName="peer text-lg font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-foreground data-[active]:text-foreground"
                underlineClassName="h-px w-0 bg-foreground transition-[width] duration-300 group-hover:w-1/4 peer-data-[active]:w-1/4"
            />
        </aside>
    );
}
