// Navigation rendered by the sidebar. `labelKey` is a key under the "Nav"
// message namespace; NavSidebarLinks resolves it to the active locale.
//
// The nav is a list of groups rather than a flat list: each group heading is
// itself a link, and its children are indented behind a rule that marks them as
// belonging to it. A group without children is just a heading.
export type NavLink = {
    href: string;
    labelKey: string;
};

export type NavGroup = NavLink & {
    children?: NavLink[];
};

export const navGroups: NavGroup[] = [
    {
        href: "/",
        labelKey: "home",
        children: [
            { href: "/projects", labelKey: "projects" },
            { href: "/personal-setup", labelKey: "personalSetup" },
        ],
    },
    {
        href: "/blog",
        labelKey: "blog",
    },
];
