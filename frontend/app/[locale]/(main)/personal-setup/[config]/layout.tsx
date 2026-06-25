import type { ReactNode } from "react";

import { ConfigShell } from "@/features/setup/components/config-shell";

interface Props {
    children: ReactNode;
    params: Promise<{ config: string }>;
}

// Persists the file selector across the config; the file page renders as content.
export default async function ConfigLayout({ children, params }: Props) {
    const { config } = await params;

    return <ConfigShell slug={config}>{children}</ConfigShell>;
}
