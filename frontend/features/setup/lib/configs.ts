import "server-only";

import { cache } from "react";

import { callApi } from "@/lib/api";

// Mirrors the backend ConfigResponse: a curation pointer to a dotfiles folder
// plus presentation (label/icon). File contents are fetched from GitHub.
export interface Config {
    id: string;
    slug: string;
    label: string;
    icon: string;
    path: string;
    position: number;
    visible: boolean;
    created_at: string;
    updated_at: string;
}

interface PaginatedConfigs {
    items: Config[];
    total: number;
}

// Cached per request so the layout and the [config] page share one fetch.
// Public, visible-only, ordered by position server-side.
export const getVisibleConfigs = cache(async (): Promise<Config[]> => {
    const res = await callApi<PaginatedConfigs>(
        "/configs?visible=true&page_size=100",
        { auth: false },
    );
    return res.items;
});
