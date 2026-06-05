"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text } from "@/components/typography/text";
import { useViewportSize } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
    className?: string;
}

interface BreadcrumbItem {
    href: string;
    label: string;
}

interface BreadcrumbParts {
    start: BreadcrumbItem[];
    hidden: BreadcrumbItem[];
    end: BreadcrumbItem[];
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const { width } = useViewportSize();
    const items = getBreadcrumbItems(segments);
    const parts = getBreadcrumbParts(items, width);
    const currentHref = items.at(-1)?.href;

    return (
        <nav className={cn("flex min-w-0 items-center gap-2", className)}>
            <Link
                href="/"
                className="text-muted-foreground transition-colors hover:text-foreground"
            >
                <Text as="span" variant="headingMd">
                    ~
                </Text>
            </Link>
            <BreadcrumbLinks items={parts.start} currentHref={currentHref} />
            {parts.hidden.length > 0 && (
                <BreadcrumbOverflow items={parts.hidden} />
            )}
            <BreadcrumbLinks items={parts.end} currentHref={currentHref} />
        </nav>
    );
}

function BreadcrumbLinks({
    items,
    currentHref,
}: {
    items: BreadcrumbItem[];
    currentHref?: string;
}) {
    return (
        <>
            {items.map((item) => {
                const isCurrent = item.href === currentHref;

                return (
                    <Fragment key={item.href}>
                        <BreadcrumbSeparator />
                        {isCurrent ? (
                            <Text
                                as="span"
                                variant="headingMd"
                                className="min-w-0 truncate"
                            >
                                {item.label}
                            </Text>
                        ) : (
                            <BreadcrumbLink item={item} />
                        )}
                    </Fragment>
                );
            })}
        </>
    );
}

function BreadcrumbOverflow({ items }: { items: BreadcrumbItem[] }) {
    return (
        <>
            <BreadcrumbSeparator />
            <DropdownMenu>
                <DropdownMenuTrigger
                    aria-label="Open collapsed breadcrumbs"
                    className="cursor-pointer border-0 bg-transparent p-0 text-muted-foreground transition-colors hover:text-foreground"
                >
                    <Text as="span" variant="headingMd">
                        ...
                    </Text>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-40 rounded-none border-foreground/30 p-2 shadow-none">
                    <div className="flex flex-col gap-1">
                        {items.map((item) => (
                            <BreadcrumbLink
                                key={item.href}
                                item={item}
                                className="px-2 py-1"
                            />
                        ))}
                    </div>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
}

function BreadcrumbLink({
    item,
    className,
}: {
    item: BreadcrumbItem;
    className?: string;
}) {
    return (
        <Link
            href={item.href}
            className={cn(
                "text-muted-foreground transition-colors hover:text-foreground",
                className,
            )}
        >
            <Text as="span" variant="headingMd">
                {item.label}
            </Text>
        </Link>
    );
}

function BreadcrumbSeparator() {
    return (
        <Text
            as="span"
            variant="headingMd"
            className="text-muted-foreground/40"
        >
            /
        </Text>
    );
}

function getBreadcrumbItems(segments: string[]): BreadcrumbItem[] {
    return segments.map((segment, index) => ({
        href: "/" + segments.slice(0, index + 1).join("/"),
        label: segment,
    }));
}

function getBreadcrumbParts(
    items: BreadcrumbItem[],
    width: number,
): BreadcrumbParts {
    const keepLast = getKeepLastCount(width);

    if (items.length <= keepLast + 1) {
        return { start: items, hidden: [], end: [] };
    }

    return {
        start: items.slice(0, 1),
        hidden: items.slice(1, -keepLast),
        end: items.slice(-keepLast),
    };
}

function getKeepLastCount(width: number): number {
    if (width === 0) return 3;
    if (width <= 480) return 1;
    if (width <= 720) return 2;
    if (width <= 1024) return 3;
    return Number.MAX_SAFE_INTEGER;
}
