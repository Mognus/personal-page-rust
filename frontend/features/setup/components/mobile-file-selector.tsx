"use client";

import { FileText, FolderTree, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

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
// the file panel when open. The panel shows one section at a time (files or
// docs); a floating top-right button swaps to the other and morphs into it.
export function MobileFileSelector({
    slug,
    configPath,
    files,
    open,
    onToggle,
}: MobileFileSelectorProps) {
    const t = useTranslations("Setup");
    const { markdownFiles, configFiles } = splitConfigFiles(files);
    const [showingFiles, setShowingFiles] = useState(true);

    if (!open) {
        return (
            <div className="flex h-full min-h-0 flex-col overflow-hidden border-t border-foreground/40">
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
            </div>
        );
    }

    return (
        <div className="relative flex h-full min-h-0 flex-col overflow-hidden border-t border-foreground/40">
            {/* Floating switch: shows the section you'd switch to. */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => setShowingFiles((value) => !value)}
                className="absolute top-2 right-2 z-10 gap-1.5 rounded-none"
            >
                {showingFiles ? (
                    <FileText className="size-4" />
                ) : (
                    <FolderTree className="size-4" />
                )}
                {showingFiles ? t("docs") : t("files")}
            </Button>

            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4">
                {showingFiles ? (
                    <FileTree
                        as="div"
                        slug={slug}
                        configPath={configPath}
                        files={configFiles}
                    />
                ) : (
                    <MarkdownSection
                        as="div"
                        slug={slug}
                        configPath={configPath}
                        files={markdownFiles}
                    />
                )}
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
        </div>
    );
}
