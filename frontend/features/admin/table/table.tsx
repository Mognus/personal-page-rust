import type { ReactNode } from "react";

import type {
    Column,
    TableAlign,
    TableClassNames,
} from "@/features/admin/table/types";
import { cn } from "@/lib/utils";

const alignClassNames: Record<TableAlign, string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
};

function renderCell<T>(row: T, column: Column<T>): ReactNode {
    if (column.render) return column.render(row);
    if (!column.accessor) return null;
    const value = row[column.accessor];
    if (value === null || value === undefined) return null;
    return String(value);
}

interface TableProps<T> {
    columns: Column<T>[];
    rows: T[];
    getRowKey: (row: T, index: number) => string | number;
    onRowClick?: (row: T) => void;
    emptyText?: ReactNode;
    classNames?: TableClassNames;
}

export function Table<T>({
    columns,
    rows,
    getRowKey,
    onRowClick,
    emptyText = "No data",
    classNames = {},
}: TableProps<T>) {
    const visibleColumns = columns.filter((c) => c.visible !== false);

    return (
        <div
            className={cn(
                "w-full overflow-x-auto border border-foreground/20",
                classNames.root,
            )}
        >
            <table className="w-full min-w-max border-collapse text-sm">
                <thead className="sticky top-0 border-b border-foreground/20 bg-background">
                    <tr>
                        {visibleColumns.map((column) => (
                            <th
                                key={column.key}
                                className={cn(
                                    "px-4 py-3 text-xs font-semibold text-muted-foreground",
                                    alignClassNames[column.align ?? "left"],
                                    classNames.th,
                                    column.headerClassName,
                                )}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.length === 0 ? (
                        <tr>
                            <td
                                colSpan={visibleColumns.length}
                                className="px-4 py-10 text-center text-muted-foreground"
                            >
                                {emptyText}
                            </td>
                        </tr>
                    ) : (
                        rows.map((row, rowIndex) => (
                            <tr
                                key={getRowKey(row, rowIndex)}
                                onClick={
                                    onRowClick
                                        ? () => onRowClick(row)
                                        : undefined
                                }
                                className={cn(
                                    "border-b border-foreground/10 last:border-b-0",
                                    onRowClick &&
                                        "cursor-pointer hover:bg-accent/50",
                                    classNames.tr,
                                )}
                            >
                                {visibleColumns.map((column) => (
                                    <td
                                        key={column.key}
                                        className={cn(
                                            "px-4 py-3 text-foreground",
                                            alignClassNames[
                                                column.align ?? "left"
                                            ],
                                            classNames.td,
                                            column.className,
                                        )}
                                    >
                                        {renderCell(row, column)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
