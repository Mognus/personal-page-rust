"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { ExternalLink } from "lucide-react";

import { MarkdownRenderer } from "@/components/content-renderer/markdown-renderer";
import { Text } from "@/components/typography/text";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import type {
    GithubRepository,
    GithubRepositoryLanguages,
} from "@/lib/github";
import { cn } from "@/lib/utils";

interface ProjectPageContentProps {
    label: string;
    languages: GithubRepositoryLanguages;
    readmeContent: string;
    readmeHighlightedHtml?: string | null;
    readmeHtml: string;
    repository: GithubRepository;
}

export function ProjectPageContent({
    label,
    languages,
    readmeContent,
    readmeHighlightedHtml,
    readmeHtml,
    repository,
}: ProjectPageContentProps) {
    const t = useTranslations("Projects");
    const [view, setView] = useState<"details" | "readme">("details");
    const sizerRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState<number>();

    // CSS can't transition to/from "auto"/"fit-content" (both views need to hug
    // their own content instead of a shared fixed height), so we measure the
    // natural size of sizerRef and drive the animated height ourselves.
    useLayoutEffect(() => {
        const node = sizerRef.current;
        if (!node) return;

        const observer = new ResizeObserver(([entry]) => {
            setHeight(entry.contentRect.height);
        });
        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            className={cn(
                "max-h-[80vh] overflow-hidden transition-[width,height] duration-300 ease-out",
                view === "readme"
                    ? "w-[clamp(19rem,58vw,44rem)] [@media_(orientation:portrait)]:w-[clamp(16rem,80vw,29rem)]"
                    : "w-[clamp(18rem,44vw,34rem)] [@media_(orientation:portrait)]:w-[clamp(15rem,76vw,26rem)]",
            )}
            style={{ height }}
        >
            {/* flex-col, not grid: a grid's auto track cannot shrink below its
                items' min-content, so a wide code block would widen the whole
                card and push the header link out of the clipped box. Flex items
                just stretch to the container width, which keeps the scrolling
                inside the README pane. */}
            <div ref={sizerRef} className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                    <Text variant="eyebrow">{label}</Text>
                    {/* Fixed to the header so it stays reachable even if the
                        content below scrolls. */}
                    <a
                        className="flex shrink-0 items-center gap-1 text-xs uppercase tracking-widest text-blue-500 hover:underline"
                        href={repository.html_url}
                        rel="noreferrer"
                        target="_blank"
                    >
                        {t("viewRepository")}
                        <ExternalLink className="size-3.5" strokeWidth={1.5} />
                    </a>
                </div>

                {view === "readme" ? (
                    <div className="h-[clamp(14rem,calc(64vh_-_4.5rem),40rem)] [@media_(orientation:portrait)]:h-[clamp(18rem,calc(70vh_-_4.5rem),38rem)]">
                        <MarkdownRenderer
                            content={readmeContent}
                            contentClassName="py-1"
                            highlightedHtml={readmeHighlightedHtml}
                            markdownHtml={readmeHtml}
                            rawContentClassName="py-1"
                        />
                    </div>
                ) : (
                    <ProjectDetails
                        languages={languages}
                        repository={repository}
                    />
                )}

                <div className="flex items-center justify-between gap-4">
                    <Link
                        className="text-xs uppercase tracking-widest text-foreground/60 hover:text-foreground"
                        href="/projects"
                    >
                        {t("back")}
                    </Link>
                    <Button
                        variant="ghost"
                        className="px-0"
                        onClick={() =>
                            setView(view === "readme" ? "details" : "readme")
                        }
                        type="button"
                    >
                        {view === "readme" ? t("showDetails") : t("showReadme")}
                    </Button>
                </div>
            </div>
        </div>
    );
}

function ProjectDetails({
    languages,
    repository,
}: {
    languages: GithubRepositoryLanguages;
    repository: GithubRepository;
}) {
    const t = useTranslations("Projects");
    const locale = useLocale();

    return (
        <div className="grid gap-2">
            <Text variant="bodyMuted">
                {repository.description ?? t("noDescription")}
            </Text>
            <ProjectMeta
                label={t("languages")}
                value={formatLanguages(
                    languages,
                    repository.language,
                    t("unknown"),
                )}
            />
            <ProjectMeta
                label={t("updated")}
                value={formatDate(repository.updated_at, locale)}
            />
            <ProjectMeta
                label={t("topics")}
                value={
                    repository.topics.length > 0
                        ? repository.topics.join(" / ")
                        : t("noTopics")
                }
            />
        </div>
    );
}

function formatLanguages(
    languages: GithubRepositoryLanguages,
    fallbackLanguage: string | null,
    unknownLabel: string,
) {
    const totalBytes = Object.values(languages).reduce(
        (total, bytes) => total + bytes,
        0,
    );

    if (!totalBytes) return fallbackLanguage ?? unknownLabel;

    return Object.entries(languages)
        .sort(([, leftBytes], [, rightBytes]) => rightBytes - leftBytes)
        .map(
            ([language, bytes]) =>
                `${language} ${Math.round((bytes / totalBytes) * 100)}%`,
        )
        .join(" / ");
}

function ProjectMeta({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid grid-cols-[auto_1fr] gap-3">
            <Text as="span" variant="captionFaint">
                {label}
            </Text>
            <Text as="span" variant="captionMuted">
                {value}
            </Text>
        </div>
    );
}

function formatDate(value: string, locale: string) {
    return new Intl.DateTimeFormat(locale, {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(new Date(value));
}
