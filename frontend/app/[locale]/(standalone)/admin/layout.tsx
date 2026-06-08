import { notFound } from "next/navigation";

import { AdminShell } from "@/features/admin/components/admin-shell";
import { authApi } from "@/features/auth/lib/auth-api";
import { UserStoreProvider } from "@/features/auth/store/user-store";

// Admin gate: only admins get in (others 404). NOTE: the backend /users routes
// are currently only auth-gated, not role-gated — this UI check is cosmetic
// until the backend enforces the admin role.
export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const me = await authApi.me();
    if (!me.ok || me.data.role !== "admin") notFound();

    return (
        <UserStoreProvider initialUser={me.data}>
            <AdminShell>{children}</AdminShell>
        </UserStoreProvider>
    );
}
