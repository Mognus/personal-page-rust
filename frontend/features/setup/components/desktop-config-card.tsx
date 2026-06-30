"use client";

import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import { Text } from "@/components/typography/text";
import { FileTree } from "@/features/setup/components/file-list/file-tree";
import { ImageSection } from "@/features/setup/components/file-list/image-section";
import { MarkdownSection } from "@/features/setup/components/file-list/markdown-section";
import { splitConfigFiles } from "@/features/setup/lib/file-tree";
import type { GithubEntry } from "@/lib/github";

interface DesktopConfigCardProps {
    slug: string;
    configPath: string;
    files: GithubEntry[];
    children: ReactNode;
}

// Desktop: file selector on the left (sized to content), content fills the rest.
export function DesktopConfigCard({
    slug,
    configPath,
    files,
    children,
}: DesktopConfigCardProps) {
    const t = useTranslations("Setup");
    const { markdownFiles, imageFiles, configFiles } = splitConfigFiles(files);

    return (
        <div className="flex min-h-0 flex-1 flex-row bg-background">
            <div className="flex min-h-0 w-fit max-w-[24rem] min-w-[14rem] shrink-0 flex-col overflow-hidden border-r border-foreground/40">
                <div className="shrink-0 px-6 py-3">
                    <Text variant="eyebrowMuted">{t("selection")}</Text>
                </div>
                {/* Docs + Files share one region — Files fills it and scrolls
                    internally. Images sit below, capped so a long image grid
                    never starves the tree. */}
                <ul className="flex min-h-0 flex-1 flex-col gap-5 px-3 pb-3">
                    <li className="flex min-h-0 flex-1 flex-col gap-5">
                        {markdownFiles.length > 0 && (
                            <div className="flex min-h-0 shrink-0 flex-col">
                                <MarkdownSection
                                    as="div"
                                    slug={slug}
                                    configPath={configPath}
                                    files={markdownFiles}
                                />
                            </div>
                        )}
                        {configFiles.length > 0 && (
                            <div className="flex min-h-0 flex-1 flex-col">
                                <FileTree
                                    as="div"
                                    slug={slug}
                                    configPath={configPath}
                                    files={configFiles}
                                />
                            </div>
                        )}
                    </li>
                    {imageFiles.length > 0 && (
                        <li className="flex max-h-[45%] min-h-0 shrink-0 flex-col">
                            <ImageSection as="div" files={imageFiles} />
                        </li>
                    )}
                </ul>
            </div>
            <div className="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">
                {children}
            </div>
        </div>
    );
}
