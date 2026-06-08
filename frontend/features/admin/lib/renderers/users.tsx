import type { AdminRenderers } from "@/features/admin/hooks/use-admin-table";

export const userRenderers: AdminRenderers = {
    created_at: (value) =>
        typeof value === "string" ? new Date(value).toLocaleDateString() : "-",
};
