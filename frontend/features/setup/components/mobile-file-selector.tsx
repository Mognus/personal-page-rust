"use client";

import { FolderTree, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { FileTree } from "@/features/setup/components/file-list/file-tree";
import { MarkdownSection } from "@/features/setup/components/file-list/markdown-section";
import { splitConfigFiles } from "@/features/setup/lib/file-tree";
import type { GithubEntry } from "@/lib/github";

interface MobileFileSelectorProps {
    slug: string;
    configPath: string;
    files: GithubEntry[];
    open: boolean;
    onToggle: () => void;
}

// The selector that fills the bottom grid cell: a full-cell button when closed,
// the file panel (trees + close button) when open. The parent grid morphs the
// cell height, so this only swaps its contents.
export function MobileFileSelector({
    slug,
    configPath,
    files,
    open,
    onToggle,
}: MobileFileSelectorProps) {
    const t = useTranslations("Setup");
    const { markdownFiles, configFiles } = splitConfigFiles(files);

    return (
        <div className="flex h-full min-h-0 flex-col overflow-hidden border-t border-foreground/40">
            {open ? (
                <>
                    <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto p-4">
                        <MarkdownSection
                            as="div"
                            slug={slug}
                            configPath={configPath}
                            files={markdownFiles}
                        />
                        <FileTree
                            as="div"
                            slug={slug}
                            configPath={configPath}
                            files={configFiles}
                        />
                    </div>
                    <div className="flex shrink-0 justify-end border-t border-foreground/40 p-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={onToggle}
                            aria-label={t("back")}
                            className="rounded-none"
                        >
                            <X className="size-5" />
                        </Button>
                    </div>
                </>
            ) : (
                <Button
                    variant="ghost"
                    onClick={onToggle}
                    className="h-full w-full gap-2 rounded-none"
                >
                    <FolderTree className="size-5" />
                    <Text as="span" variant="eyebrow">
                        {t("selection")}
                    </Text>
                </Button>
            )}
        </div>
    );
}
