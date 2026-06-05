import { cookies } from "next/headers";

import { authApi } from "@/features/auth/lib/auth-api";
import { UserStoreProvider } from "@/features/auth/store/user-store";
import { ResponsiveShell } from "@/features/sidebar/components/responsive-shell";
import { VIEWPORT_COOKIE } from "@/features/sidebar/lib/cookies";

// Layout for the app shell: sidebar, header, social rail, cube background.
export default async function MainLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Pick the shell server-side from the viewport cookie to avoid a flash.
    const initialIsMobile =
        (await cookies()).get(VIEWPORT_COOKIE)?.value === "mobile";

    // Seed the user store from the server so the sidebar renders the signed-in
    // user without a client round-trip or flash.
    const me = await authApi.me();
    const initialUser = me.ok ? me.data : null;

    return (
        <UserStoreProvider initialUser={initialUser}>
            <ResponsiveShell initialIsMobile={initialIsMobile}>
                {children}
            </ResponsiveShell>
        </UserStoreProvider>
    );
}
