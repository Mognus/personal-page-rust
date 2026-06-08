"use client";

import type { ReactNode } from "react";

import type { AdminRecord, AdminSchema } from "@/features/admin/lib/types";
import type { Column } from "@/features/admin/table/types";
import {
    useTable,
    type UseTableReturn,
} from "@/features/admin/table/use-table";

export type AdminRenderers = Partial<
    Record<string, (value: unknown) => ReactNode>
>;

function formatValue(value: unknown): string {
    if (value === null || value === undefined || value === "") return "-";
    if (typeof value === "boolean") return value ? "true" : "false";
    if (typeof value === "object") return JSON.stringify(value);
    return String(value);
}

interface UseAdminTableOptions {
    schema: AdminSchema;
    renderers?: AdminRenderers;
    defaultPage?: number;
    defaultLimit?: number;
}

// Builds table columns from the schema (skipping tableHidden fields) and wires
// up the URL-driven table state.
export function useAdminTable({
    schema,
    renderers,
    defaultPage,
    defaultLimit,
}: UseAdminTableOptions): UseTableReturn<AdminRecord> {
    const columns: Column<AdminRecord>[] = schema.fields
        .filter((f) => !f.tableHidden)
        .map((f) => ({
            key: f.name,
            header: f.label,
            type: f.type,
            render: renderers?.[f.name]
                ? (row) => renderers[f.name]!(row[f.name])
                : (row) => formatValue(row[f.name]),
        }));

    return useTable<AdminRecord>({ columns, defaultPage, defaultLimit });
}
