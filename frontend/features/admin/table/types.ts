import type { ReactNode } from "react";

export type TableAlign = "left" | "center" | "right";

export interface Column<T> {
    key: string;
    header: ReactNode;
    type?: string;
    accessor?: keyof T;
    render?: (row: T) => ReactNode;
    align?: TableAlign;
    className?: string;
    headerClassName?: string;
    visible?: boolean;
}

export interface TableClassNames {
    root?: string;
    th?: string;
    tr?: string;
    td?: string;
}
