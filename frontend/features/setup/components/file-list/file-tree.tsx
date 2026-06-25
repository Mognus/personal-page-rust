"use client";

import { ChevronRight, File, Folder } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Text } from "@/components/typography/text";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    buildFileTree,
    getFileHref,
    isActiveFilePath,
    type FileTreeNode,
} from "@/features/setup/lib/file-tree";
import { Link, usePathname } from "@/i18n/navigation";
import type { GithubEntry } from "@/lib/github";
import { cn } from "@/lib/utils";

interface FileTreeProps {
    slug: string;
    configPath: string;
    files: GithubEntry[];
    as?: "li" | "div";
}

interface FileTreeItemProps {
    slug: string;
    configPath: string;
    node: FileTreeNode;
    pathname: string;
}

export function FileTree({
    slug,
    configPath,
    files,
    as: Component = "li",
}: FileTreeProps) {
    const t = useTranslations("Setup");
    const pathname = usePathname();
    const tree = buildFileTree(files, configPath);

    if (tree.length === 0) return null;

    return (
        <Component className="flex min-h-0 flex-col gap-2">
            <Text variant="headingSm" className="px-3 uppercase">
                {t("files")}
            </Text>
            <ul className="flex min-h-0 flex-col overflow-y-auto pl-4">
                {tree.map((node) => (
                    <FileTreeItem
                        key={node.sha}
                        slug={slug}
                        configPath={configPath}
                        node={node}
                        pathname={pathname}
                    />
                ))}
            </ul>
        </Component>
    );
}

function FileTreeItem({ slug, configPath, node, pathname }: FileTreeItemProps) {
    if (node.type === "dir") {
        return (
            <FileTreeFolder
                slug={slug}
                configPath={configPath}
                node={node}
                pathname={pathname}
            />
        );
    }

    if (!node.path) return null;

    const href = getFileHref(slug, configPath, node.path);
    const isActive = isActiveFilePath(pathname, href);

    return (
        <li>
            <Link
                href={href}
                className={cn(
                    "group flex w-full cursor-pointer items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-foreground/5",
                    isActive && "bg-foreground/10",
                )}
            >
                <File
                    className={cn(
                        "size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground",
                        isActive && "text-foreground",
                    )}
                />
                <Text
                    as="span"
                    variant="bodyMuted"
                    className={cn(
                        "transition-colors group-hover:text-foreground",
                        isActive && "text-foreground",
                    )}
                >
                    {node.name}
                </Text>
            </Link>
        </li>
    );
}

function FileTreeFolder({ slug, configPath, node, pathname }: FileTreeItemProps) {
    const [open, setOpen] = useState(true);

    return (
        <li>
            <Collapsible open={open} onOpenChange={setOpen}>
                <CollapsibleTrigger
                    className="group flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
                >
                    <ChevronRight
                        className={cn(
                            "size-3.5 shrink-0 transition-transform",
                            open && "rotate-90",
                        )}
                    />
                    <Folder className="size-3.5 shrink-0" />
                    <Text as="span" variant="bodyMuted">
                        {node.name}
                    </Text>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    <ul className="flex flex-col pl-4">
                        {node.children.map((child) => (
                            <FileTreeItem
                                key={child.sha}
                                slug={slug}
                                configPath={configPath}
                                node={child}
                                pathname={pathname}
                            />
                        ))}
                    </ul>
                </CollapsibleContent>
            </Collapsible>
        </li>
    );
}
