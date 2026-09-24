// Curation pointers at GitHub repositories: which repo to show and how to label
// it. Everything displayed — description, README, languages — is fetched from
// the GitHub API at request time, so nothing here is content.
//
// Array order is the orbit order, and a repository appears precisely because it
// is listed; that replaces the `position` and `visible` columns this used to
// carry.
export interface Project {
    slug: string;
    full_name: string;
    label: string;
}

export const projects: Project[] = [
    {
        slug: "dotfiles",
        full_name: "Mognus/linux-dotfiles",
        label: "Dotfiles",
    },
    {
        slug: "latex-application-template",
        full_name: "Mognus/latex-application-template",
        label: "LaTeX Application Template",
    },
    {
        slug: "application-typst",
        full_name: "Mognus/application-typst",
        label: "Application Typst",
    },
    {
        slug: "interactive-movie-berlin-students",
        full_name: "Mognus/interactive-movie-berlin-students",
        label: "Interactive Movie Berlin",
    },
    {
        slug: "personal-page-rust",
        full_name: "Mognus/personal-page-rust",
        label: "Personal Page Rust",
    },
    {
        slug: "schnur23",
        full_name: "Mognus/schnur23-page",
        label: "Schnur23",
    },
];

// The orbit position with its derived enso angle. The angle is computed from
// order + count (NOT stored), so the ring stays evenly spaced as projects change.
export interface ProjectOrbit extends Project {
    href: string;
    angle: number;
}

// Derives the orbit layout (href + evenly-spaced angle) from the ordered list.
export function toOrbit(projects: Project[]): ProjectOrbit[] {
    const count = projects.length;
    return projects.map((project, index) => ({
        ...project,
        href: `/projects/${project.slug}`,
        angle: count > 0 ? (360 / count) * index : 0,
    }));
}
