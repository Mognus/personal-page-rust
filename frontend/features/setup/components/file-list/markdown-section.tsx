"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/typography/text";
import { getFileHref, isActiveFilePath } from "@/features/setup/lib/file-tree";
import { Link, usePathname } from "@/i18n/navigation";
import type { GithubEntry } from "@/lib/github";
import { cn } from "@/lib/utils";

interface MarkdownSectionProps {
    slug: string;
    configPath: string;
    files: GithubEntry[];
    as?: "li" | "div";
}

export function MarkdownSection({
    slug,
    configPath,
    files,
    as: Component = "li",
}: MarkdownSectionProps) {
    const t = useTranslations("Setup");
    const pathname = usePathname();

    if (files.length === 0) return null;

    return (
        <Component className="flex min-h-0 flex-col gap-2">
            <Text variant="headingSm" className="px-3 uppercase">
                {t("docs")}
            </Text>
            <ul className="flex min-h-0 flex-col overflow-y-auto pl-4">
                {files.map((file) => {
                    const href = getFileHref(slug, configPath, file.path);
                    const isActive = isActiveFilePath(pathname, href);

                    return (
                        <li key={file.sha}>
                            <Link
                                href={href}
                                className={cn(
                                    "group flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-foreground/5",
                                    isActive && "bg-foreground/10",
                                )}
                            >
                                <Text
                                    as="span"
                                    variant="bodyMuted"
                                    className={cn(
                                        "transition-colors group-hover:text-foreground",
                                        isActive && "text-foreground",
                                    )}
                                >
                                    {file.name}
                                </Text>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </Component>
    );
}
