import { notFound } from "next/navigation";

import { AdminDataTable } from "@/features/admin/components/admin-data-table";
import { fetchAdminList } from "@/features/admin/lib/list";
import { getAdminResource } from "@/features/admin/lib/resources";
import type { AdminRecord } from "@/features/admin/lib/types";

interface Props {
    params: Promise<{ model: string }>;
    searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ModelPage({ params, searchParams }: Props) {
    const { model } = await params;
    const resource = getAdminResource(model);
    if (!resource) notFound();

    const sp = await searchParams;
    const page = sp.page ? Number(sp.page) : 1;
    const limit = sp.limit ? Number(sp.limit) : 20;

    // Everything other than page/limit is forwarded to the backend as a filter
    // (search, role, …); the backend takes what it knows and rejects the rest.
    const filters = Object.fromEntries(
        Object.entries(sp).filter(
            ([key, value]) =>
                value !== undefined && key !== "page" && key !== "limit",
        ),
    ) as Record<string, string>;

    let rows: AdminRecord[] = [];
    let total = 0;
    let failed = false;
    try {
        const list = await fetchAdminList(resource.apiPath, {
            page,
            pageSize: limit,
            filters,
        });
        rows = list.rows;
        total = list.total;
    } catch (error) {
        // Server component → can't toast (Sonner is client-side); log it so the
        // real failure is visible in the server output, UI degrades gracefully.
        console.error("admin list fetch failed", error);
        failed = true;
    }

    return (
        <div className="flex h-full flex-col gap-6 p-6">
            <div>
                <h1 className="font-syne text-xl font-semibold uppercase tracking-[0.15em]">
                    {resource.schema.displayName}
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    {failed ? "Failed to load." : `${total} entries`}
                </p>
            </div>
            <AdminDataTable
                resource={model}
                schema={resource.schema}
                rows={rows}
                total={total}
                className="min-h-0 flex-1"
                defaultPage={page}
                defaultLimit={limit}
            />
        </div>
    );
}
