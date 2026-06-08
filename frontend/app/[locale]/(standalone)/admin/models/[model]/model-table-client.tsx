"use client";

import { AdminDataTable } from "@/features/admin/components/admin-data-table";
import type { AdminRenderers } from "@/features/admin/hooks/use-admin-table";
import { userRenderers } from "@/features/admin/lib/renderers/users";
import type { AdminRecord, AdminSchema } from "@/features/admin/lib/types";

// Renderers contain functions and can't cross the server/client boundary, so
// the renderer lookup happens here (client) before reaching AdminDataTable.
const modelRenderers: Record<string, AdminRenderers> = {
    users: userRenderers,
};

interface ModelTableClientProps {
    schema: AdminSchema;
    model: string;
    rows: AdminRecord[];
    total: number;
    className?: string;
    defaultPage?: number;
    defaultLimit?: number;
}

export function ModelTableClient({
    schema,
    model,
    rows,
    total,
    className,
    defaultPage,
    defaultLimit,
}: ModelTableClientProps) {
    return (
        <AdminDataTable
            schema={schema}
            rows={rows}
            total={total}
            renderers={modelRenderers[model]}
            className={className}
            defaultPage={defaultPage}
            defaultLimit={defaultLimit}
        />
    );
}
