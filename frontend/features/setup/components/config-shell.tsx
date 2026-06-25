import type { ReactNode } from "react";
import { notFound } from "next/navigation";

import { ConfigCard } from "@/features/setup/components/config-card";
import { getVisibleConfigs } from "@/features/setup/lib/configs";
import { getDotfilesTree } from "@/lib/github";

interface ConfigShellProps {
    slug: string;
    children: ReactNode;
}

// Server shell for an open config: resolves the slug, loads its folder tree from
// the dotfiles repo, and renders the selector + content card.
export async function ConfigShell({ slug, children }: ConfigShellProps) {
    const configs = await getVisibleConfigs();
    const config = configs.find((item) => item.slug === slug);

    if (!config) notFound();

    const files = await getDotfilesTree(config.path);

    return (
        <div className="flex h-full flex-col bg-background">
            <ConfigCard slug={slug} configPath={config.path} files={files}>
                {children}
            </ConfigCard>
        </div>
    );
}
