// Navigation links rendered by the sidebar. `labelKey` is a key under the
// "Nav" message namespace; NavSidebarLinks resolves it to the active locale.
export type NavLink = {
    href: string;
    labelKey: string;
    // Nested under a parent entry (e.g. Home) — rendered slightly indented.
    indent?: boolean;
};

export const links: NavLink[] = [
    { href: "/", labelKey: "home" },
    { href: "/projects", labelKey: "projects", indent: true },
    { href: "/personal-setup", labelKey: "personalSetup", indent: true },
];
