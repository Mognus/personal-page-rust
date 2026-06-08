"use client";

import { useCallback, useState } from "react";

import { usePathname, useRouter } from "@/i18n/navigation";
import type { Column } from "@/features/admin/table/types";

interface TableState<T> {
    page: number;
    limit: number;
    filters: Record<string, string>;
    columns: Column<T>[];
}

export interface UseTableReturn<T> {
    page: number;
    limit: number;
    filters: Record<string, string>;
    columns: Column<T>[];
    visibleColumns: Column<T>[];
    setPage: (page: number) => void;
    setLimit: (limit: number) => void;
    setFilter: (key: string, value: string) => void;
    clearFilter: (key: string) => void;
}

interface UseTableOptions<T> {
    columns: Column<T>[];
    defaultPage?: number;
    defaultLimit?: number;
}

// Table state lives in the URL (?page=&limit=&<filter>=) so the server page can
// read it and re-fetch. Locale-aware via @/i18n/navigation.
export function useTable<T>({
    columns,
    defaultPage = 1,
    defaultLimit = 20,
}: UseTableOptions<T>): UseTableReturn<T> {
    const router = useRouter();
    const pathname = usePathname();

    const [state, setState] = useState<TableState<T>>({
        page: defaultPage,
        limit: defaultLimit,
        filters: {},
        columns,
    });

    const pushParams = useCallback(
        (page: number, limit: number, filters: Record<string, string>) => {
            const params = new URLSearchParams({
                page: String(page),
                limit: String(limit),
                ...filters,
            });
            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname],
    );

    function setPage(value: number) {
        setState((s) => ({ ...s, page: value }));
        pushParams(value, state.limit, state.filters);
    }

    function setLimit(value: number) {
        setState((s) => ({ ...s, limit: value, page: 1 }));
        pushParams(1, value, state.filters);
    }

    function setFilter(key: string, value: string) {
        const filters = { ...state.filters, [key]: value };
        setState((s) => ({ ...s, filters, page: 1 }));
        pushParams(1, state.limit, filters);
    }

    function clearFilter(key: string) {
        const filters = { ...state.filters };
        delete filters[key];
        setState((s) => ({ ...s, filters, page: 1 }));
        pushParams(1, state.limit, filters);
    }

    return {
        ...state,
        visibleColumns: state.columns.filter((c) => c.visible !== false),
        setPage,
        setLimit,
        setFilter,
        clearFilter,
    };
}
