"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/typography/text";
import { FileTree } from "@/features/setup/components/file-list/file-tree";
import { FileTreeDropUp } from "@/features/setup/components/file-list/file-tree-drop-up";
import { MarkdownSection } from "@/features/setup/components/file-list/markdown-section";
import { MarkdownSectionDropUp } from "@/features/setup/components/file-list/markdown-section-drop-up";
import { BREAKPOINTS } from "@/features/sidebar/lib/breakpoints";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { GithubEntry } from "@/lib/github";
import { cn } from "@/lib/utils";

interface ConfigFileListProps {
    slug: string;
    configPath: string;
    files: GithubEntry[];
}

// File selector: documentation (.md) and config files split into two sections.
// Desktop shows both inline; mobile collapses each into a drop-up.
export function ConfigFileList({ slug, configPath, files }: ConfigFileListProps) {
    const t = useTranslations("Setup");
    const isMobile = useMediaQuery(`(max-width: ${BREAKPOINTS.mobile}px)`);

    const fileEntries = files.filter((file) => file.type === "file");
    const markdownFiles = fileEntries.filter((file) =>
        file.name.toLowerCase().endsWith(".md"),
    );
    const configFiles = fileEntries.filter(
        (file) => !file.name.toLowerCase().endsWith(".md"),
    );

    return (
        <div className="flex h-full min-h-0 flex-col">
            <div className="shrink-0 px-6 py-3">
                <Text variant="eyebrowMuted">{t("selection")}</Text>
            </div>
            <ul
                className={cn(
                    "flex min-h-0 flex-1 px-3 pb-3",
                    isMobile
                        ? "flex-row gap-4 [&>li]:min-w-0 [&>li]:flex-1"
                        : "flex-col gap-5 [&>li:first-child]:basis-[15%] [&>li:last-child]:basis-[85%]",
                )}
            >
                {isMobile ? (
                    <>
                        <li>
                            <MarkdownSectionDropUp
                                slug={slug}
                                configPath={configPath}
                                files={markdownFiles}
                            />
                        </li>
                        <li>
                            <FileTreeDropUp
                                slug={slug}
                                configPath={configPath}
                                files={configFiles}
                            />
                        </li>
                    </>
                ) : (
                    <>
                        <MarkdownSection
                            slug={slug}
                            configPath={configPath}
                            files={markdownFiles}
                        />
                        <FileTree
                            slug={slug}
                            configPath={configPath}
                            files={configFiles}
                        />
                    </>
                )}
            </ul>
        </div>
    );
}
