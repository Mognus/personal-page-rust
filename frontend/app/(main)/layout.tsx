import { cookies } from "next/headers";

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

    return (
        <ResponsiveShell initialIsMobile={initialIsMobile}>
            {children}
        </ResponsiveShell>
    );
}
