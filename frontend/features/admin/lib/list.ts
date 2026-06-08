import type { AdminRecord } from "@/features/admin/lib/types";
import { callApi } from "@/lib/api";

// Backend PaginatedResponse shape (only the parts the table needs).
interface PaginatedResponse {
    items: AdminRecord[];
    total: number;
}

interface ListParams {
    page?: number;
    pageSize?: number;
    // Generic, model-agnostic: any column/search filter (e.g. search, role).
    // The backend accepts the params it knows and rejects unknown ones.
    filters?: Record<string, string>;
}

export interface AdminList {
    rows: AdminRecord[];
    total: number;
}

// Server-side list fetch via callApi (attaches the auth cookie). Throws on
// non-2xx — the page decides how to surface it.
export async function fetchAdminList(
    apiPath: string,
    params: ListParams = {},
): Promise<AdminList> {
    const { page = 1, pageSize = 20, filters = {} } = params;

    const query = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    });
    for (const [key, value] of Object.entries(filters)) {
        if (value) query.set(key, value);
    }

    const res = await callApi<PaginatedResponse>(`${apiPath}?${query.toString()}`);
    return { rows: res.items, total: res.total };
}
