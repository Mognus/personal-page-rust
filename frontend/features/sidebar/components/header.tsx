import { Breadcrumbs } from "@/features/sidebar/components/breadcrumbs";
import { SidebarToggle } from "@/features/sidebar/components/sidebar-toggle";

// Top bar in the main area: sidebar toggle, breadcrumbs and (right) the search
// bar slot. `id="searchbar"` marks where the search UI will live.
export function Header() {
    return (
        <header className="flex items-center gap-4 border-b border-foreground/40 px-4 py-3">
            <SidebarToggle />
            <Breadcrumbs />
            <div id="searchbar" className="ml-auto" />
        </header>
    );
}
