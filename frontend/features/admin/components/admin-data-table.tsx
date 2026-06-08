"use client";

import { AdminAddTrigger } from "@/features/admin/components/admin-add-trigger";
import { AdminRowModal } from "@/features/admin/components/admin-row-modal";
import {
    useAdminTable,
    type AdminRenderers,
} from "@/features/admin/hooks/use-admin-table";
import { userRenderers } from "@/features/admin/lib/renderers/users";
import type { AdminRecord, AdminSchema } from "@/features/admin/lib/types";
import { DataTable } from "@/features/admin/table/data-table";

// Per-model cell renderers. Lives here (a client component) because renderers
// are functions and can't be passed from the server page.
const modelRenderers: Record<string, AdminRenderers> = {
    users: userRenderers,
};

interface AdminDataTableProps {
    resource: string;
    schema: AdminSchema;
    rows: AdminRecord[];
    total: number;
    className?: string;
    defaultPage?: number;
    defaultLimit?: number;
}

export function AdminDataTable({
    resource,
    schema,
    rows,
    total,
    className,
    defaultPage,
    defaultLimit,
}: AdminDataTableProps) {
    const table = useAdminTable({
        schema,
        renderers: modelRenderers[resource],
        defaultPage,
        defaultLimit,
    });

    return (
        <DataTable
            table={table}
            rows={rows}
            getRowKey={(row, index) => String(row.id ?? index)}
            total={total}
            className={className}
            tableClassNames={{ th: "font-syne uppercase tracking-[0.15em]" }}
            addTrigger={<AdminAddTrigger resource={resource} schema={schema} />}
            rowActions={(row, onClose) => (
                <AdminRowModal
                    resource={resource}
                    schema={schema}
                    row={row}
                    onClose={onClose}
                />
            )}
        />
    );
}
