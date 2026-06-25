import "server-only";

import { cache } from "react";

import { callApi } from "@/lib/api";

// Mirrors the backend ProjectResponse (curation pointer + presentation only).
export interface Project {
    id: string;
    slug: string;
    full_name: string;
    label: string;
    position: number;
    visible: boolean;
    created_at: string;
    updated_at: string;
}

interface PaginatedProjects {
    items: Project[];
    total: number;
}

// The orbit position with its derived enso angle. The angle is computed from
// order + count (NOT stored), so the ring stays evenly spaced as projects change.
export interface ProjectOrbit extends Project {
    href: string;
    angle: number;
}

// Cached for the request so the layout and the [project] page share one fetch.
// Reads the public, visible-only list, already ordered by position server-side.
export const getVisibleProjects = cache(async (): Promise<Project[]> => {
    const res = await callApi<PaginatedProjects>(
        "/projects?visible=true&page_size=100",
        { auth: false },
    );
    return res.items;
});

// Derives the orbit layout (href + evenly-spaced angle) from the ordered list.
export function toOrbit(projects: Project[]): ProjectOrbit[] {
    const count = projects.length;
    return projects.map((project, index) => ({
        ...project,
        href: `/projects/${project.slug}`,
        angle: count > 0 ? (360 / count) * index : 0,
    }));
}
