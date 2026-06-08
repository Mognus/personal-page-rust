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
    search?: string;
    role?: string;
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
    const { page = 1, pageSize = 20, search, role } = params;

    const query = new URLSearchParams({
        page: String(page),
        page_size: String(pageSize),
    });
    if (search) query.set("search", search);
    if (role) query.set("role", role);

    const res = await callApi<PaginatedResponse>(
        `${apiPath}?${query.toString()}`,
    );
    return { rows: res.items, total: res.total };
}
