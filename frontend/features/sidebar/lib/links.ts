// Navigation links rendered by the sidebar. `labelKey` is a key under the
// "Nav" message namespace; NavSidebarLinks resolves it to the active locale.
export type NavLink = {
    href: string;
    labelKey: string;
};

export const links: NavLink[] = [
    { href: "/projects", labelKey: "projects" },
    { href: "/personal-setup", labelKey: "personalSetup" },
];
