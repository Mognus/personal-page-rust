"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { PaginationControl } from "@/features/admin/table/pagination-control";
import { Table } from "@/features/admin/table/table";
import { TableSearch } from "@/features/admin/table/table-search";
import type { UseTableReturn } from "@/features/admin/table/use-table";
import type { TableClassNames } from "@/features/admin/table/types";
import { cn } from "@/lib/utils";

interface DataTableProps<T> {
    table: UseTableReturn<T>;
    rows: T[];
    getRowKey: (row: T, index: number) => string | number;
    total: number;
    // Slots for later (create button / row edit-delete modal). Unused for now.
    addTrigger?: ReactNode;
    rowActions?: (row: T, onClose: () => void) => ReactNode;
    className?: string;
    tableClassNames?: TableClassNames;
}

export function DataTable<T>({
    table,
    rows,
    getRowKey,
    total,
    addTrigger,
    rowActions,
    className,
    tableClassNames,
}: DataTableProps<T>) {
    const [selectedRow, setSelectedRow] = useState<T | null>(null);

    return (
        <>
            <div className={cn("flex h-full flex-col gap-4", className)}>
                <div className="flex items-center justify-between">
                    <TableSearch table={table} />
                    {addTrigger}
                </div>
                <Table
                    columns={table.visibleColumns}
                    rows={rows}
                    getRowKey={getRowKey}
                    onRowClick={rowActions ? setSelectedRow : undefined}
                    classNames={{
                        ...tableClassNames,
                        root: cn(
                            "min-h-0 flex-1 overflow-y-auto",
                            tableClassNames?.root,
                        ),
                    }}
                />
                <PaginationControl table={table} total={total} />
            </div>
            {selectedRow &&
                rowActions?.(selectedRow, () => setSelectedRow(null))}
        </>
    );
}
