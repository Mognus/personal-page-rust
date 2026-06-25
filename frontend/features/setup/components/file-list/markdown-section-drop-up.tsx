"use client";

import { FileText } from "lucide-react";
import { useTranslations } from "next-intl";

import { Text } from "@/components/typography/text";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MarkdownSection } from "@/features/setup/components/file-list/markdown-section";
import type { GithubEntry } from "@/lib/github";

interface MarkdownSectionDropUpProps {
    slug: string;
    configPath: string;
    files: GithubEntry[];
}

// Mobile affordance for the documentation (.md) files; desktop shows them inline.
export function MarkdownSectionDropUp({
    slug,
    configPath,
    files,
}: MarkdownSectionDropUpProps) {
    const t = useTranslations("Setup");

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex h-full w-full cursor-pointer items-center justify-center gap-2 border border-foreground/40 p-4 transition-colors hover:border-foreground">
                <FileText className="size-5" />
                <Text as="span" variant="eyebrow">
                    {t("docs")}
                </Text>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="top"
                className="max-h-[20vh] w-max max-w-[calc(100vw-3rem)] overflow-y-auto rounded-none border-foreground/60 bg-background/95 p-4 backdrop-blur-sm"
            >
                <MarkdownSection
                    as="div"
                    slug={slug}
                    configPath={configPath}
                    files={files}
                />
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
