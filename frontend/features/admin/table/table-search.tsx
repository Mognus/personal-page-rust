"use client";

import type { UseTableReturn } from "@/features/admin/table/use-table";

interface TableSearchProps<T> {
    table: Pick<UseTableReturn<T>, "filters" | "setFilter" | "clearFilter">;
}

// Single free-text search bound to the `search` filter (the backend handles
// which columns it matches).
export function TableSearch<T>({ table }: TableSearchProps<T>) {
    const value = table.filters.search ?? "";

    function handleChange(input: string) {
        if (input) table.setFilter("search", input);
        else table.clearFilter("search");
    }

    return (
        <input
            type="text"
            value={value}
            placeholder="Search…"
            onChange={(e) => handleChange(e.target.value)}
            className="h-8 w-72 border border-input bg-background px-3 text-sm focus:outline-none"
        />
    );
}
