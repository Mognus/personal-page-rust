"use client";

import { FileText, FolderTree, Image as ImageIcon, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { FileTree } from "@/features/setup/components/file-list/file-tree";
import { ImageSection } from "@/features/setup/components/file-list/image-section";
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

type Tab = "files" | "docs" | "images";

// The selector that fills the bottom grid cell: a full-cell button when closed,
// the file panel when open. The panel shows one section at a time; floating
// top-right buttons show the *other* available sections to jump to.
export function MobileFileSelector({
    slug,
    configPath,
    files,
    open,
    onToggle,
}: MobileFileSelectorProps) {
    const t = useTranslations("Setup");
    const { markdownFiles, imageFiles, configFiles } = splitConfigFiles(files);
    const [active, setActive] = useState<Tab>("files");

    const tabMeta: Record<Tab, { icon: typeof FolderTree; label: string }> = {
        files: { icon: FolderTree, label: t("files") },
        docs: { icon: FileText, label: t("docs") },
        images: { icon: ImageIcon, label: t("images") },
    };

    // Only sections that have content take part; the others are offered as
    // jump targets in the floating switch.
    const available: Tab[] = [
        ...(configFiles.length ? (["files"] as const) : []),
        ...(markdownFiles.length ? (["docs"] as const) : []),
        ...(imageFiles.length ? (["images"] as const) : []),
    ];
    const current = available.includes(active)
        ? active
        : (available[0] ?? "files");
    const others = available.filter((tab) => tab !== current);

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
        <div className="flex h-full min-h-0 flex-col overflow-hidden border-t border-foreground/40">
            <div className="min-h-0 flex-1 overflow-y-auto p-4">
                {current === "files" && (
                    <FileTree
                        as="div"
                        slug={slug}
                        configPath={configPath}
                        files={configFiles}
                    />
                )}
                {current === "docs" && (
                    <MarkdownSection
                        as="div"
                        slug={slug}
                        configPath={configPath}
                        files={markdownFiles}
                    />
                )}
                {current === "images" && (
                    <ImageSection as="div" files={imageFiles} />
                )}
            </div>

            {/* Section switch bottom-left, close bottom-right. */}
            <div className="flex shrink-0 items-center justify-between border-t border-foreground/40 p-2">
                <div className="flex gap-2">
                    {others.map((tab) => {
                        const Icon = tabMeta[tab].icon;
                        return (
                            <Button
                                key={tab}
                                variant="outline"
                                size="sm"
                                onClick={() => setActive(tab)}
                                className="gap-1.5 rounded-none"
                            >
                                <Icon className="size-4" />
                                {tabMeta[tab].label}
                            </Button>
                        );
                    })}
                </div>
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
