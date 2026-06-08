"use client";

import {
    ChevronFirst,
    ChevronLast,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import type { UseTableReturn } from "@/features/admin/table/use-table";

const PAGE_SIZES = [10, 20, 50, 100];

interface PaginationControlProps<T> {
    table: Pick<UseTableReturn<T>, "page" | "limit" | "setPage" | "setLimit">;
    total: number;
}

function PageButton({
    onClick,
    disabled,
    children,
}: {
    onClick: () => void;
    disabled: boolean;
    children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onClick}
            className="flex h-8 w-8 items-center justify-center border border-input transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-40"
        >
            {children}
        </button>
    );
}

export function PaginationControl<T>({
    table,
    total,
}: PaginationControlProps<T>) {
    const { page, limit, setPage, setLimit } = table;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const from = total === 0 ? 0 : (page - 1) * limit + 1;
    const to = Math.min(page * limit, total);

    return (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
                {from}–{to} of {total}
            </span>
            <div className="flex items-center gap-3">
                <label className="flex items-center gap-2">
                    <span>Rows</span>
                    <select
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        className="h-8 border border-input bg-background px-2 text-sm focus:outline-none"
                    >
                        {PAGE_SIZES.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </label>
                <div className="flex items-center gap-1">
                    <PageButton disabled={page <= 1} onClick={() => setPage(1)}>
                        <ChevronFirst className="h-4 w-4" />
                    </PageButton>
                    <PageButton
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </PageButton>
                    <span className="w-20 text-center tabular-nums">
                        {page} / {totalPages}
                    </span>
                    <PageButton
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </PageButton>
                    <PageButton
                        disabled={page >= totalPages}
                        onClick={() => setPage(totalPages)}
                    >
                        <ChevronLast className="h-4 w-4" />
                    </PageButton>
                </div>
            </div>
        </div>
    );
}
