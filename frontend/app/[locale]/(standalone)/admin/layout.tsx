import { AdminShell } from "@/features/admin/components/admin-shell";
import { authApi } from "@/features/auth/lib/auth-api";
import { UserStoreProvider } from "@/features/auth/store/user-store";
import { redirect } from "@/i18n/navigation";

// Admin gate (UX): non-admins are sent to login. The real authorization is the
// backend require_admin middleware on /users.
export default async function AdminLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const me = await authApi.me();
    const user = me.ok ? me.data : null;
    if (!user || user.role !== "admin") {
        redirect({ href: "/login", locale });
    }

    return (
        <UserStoreProvider initialUser={user}>
            <AdminShell>{children}</AdminShell>
        </UserStoreProvider>
    );
}
