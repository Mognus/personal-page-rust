// Navigation links and the cube face each route projects onto. Single source
// of truth shared by the sidebar (renders the links) and the cube (maps the
// active route to a face).
export type CubeFace = "front" | "back" | "right" | "left" | "top" | "bottom";

export type NavLink = {
    href: string;
    label: string;
    face: CubeFace;
};

export const links: NavLink[] = [
    { href: "/", label: "Home", face: "front" },
    { href: "/projects", label: "Projects", face: "right" },
    { href: "/personal-setup", label: "Personal Setup", face: "left" },
];
