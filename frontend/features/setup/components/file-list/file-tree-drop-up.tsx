"use client";

import { FolderTree } from "lucide-react";
import { useTranslations } from "next-intl";

import { Text } from "@/components/typography/text";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileTree } from "@/features/setup/components/file-list/file-tree";
import type { GithubEntry } from "@/lib/github";

interface FileTreeDropUpProps {
    slug: string;
    configPath: string;
    files: GithubEntry[];
}

// Mobile affordance: the config file tree lives behind a drop-up so the strip
// stays compact. Desktop shows FileTree inline instead.
export function FileTreeDropUp({ slug, configPath, files }: FileTreeDropUpProps) {
    const t = useTranslations("Setup");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex h-full w-full cursor-pointer items-center justify-center gap-2 border border-foreground/40 p-4 transition-colors hover:border-foreground">
                <FolderTree className="size-5" />
                <Text as="span" variant="eyebrow">
                    {t("files")}
                </Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="end"
                side="top"
                className="max-h-[20vh] w-max max-w-[calc(100vw-3rem)] overflow-y-auto rounded-none border-foreground/60 bg-background/95 p-4 backdrop-blur-sm"
            >
                <FileTree
                    as="div"
                    slug={slug}
                    configPath={configPath}
                    files={files}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
