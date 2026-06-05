// Navigation links rendered by the sidebar.
export type NavLink = {
    href: string;
    label: string;
};

export const links: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/personal-setup", label: "Personal Setup" },
];
