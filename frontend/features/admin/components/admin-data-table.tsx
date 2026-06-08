"use client";

import {
    useAdminTable,
    type AdminRenderers,
} from "@/features/admin/hooks/use-admin-table";
import type { AdminRecord, AdminSchema } from "@/features/admin/lib/types";
import { DataTable } from "@/features/admin/table/data-table";

interface AdminDataTableProps {
    schema: AdminSchema;
    rows: AdminRecord[];
    total: number;
    renderers?: AdminRenderers;
    className?: string;
    defaultPage?: number;
    defaultLimit?: number;
}

export function AdminDataTable({
    schema,
    rows,
    total,
    renderers,
    className,
    defaultPage,
    defaultLimit,
}: AdminDataTableProps) {
    const table = useAdminTable({
        schema,
        renderers,
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
        />
    );
}
