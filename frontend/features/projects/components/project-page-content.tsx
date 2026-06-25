"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

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

    return (
        <div
            className={cn(
                "grid min-h-0 max-h-[80vh] grid-rows-[auto_minmax(0,1fr)_auto] gap-4 transition-[width,height] duration-300 ease-out",
                view === "readme"
                    ? "h-[clamp(18rem,62vh,42rem)] w-[clamp(18rem,56vw,42rem)] [@media_(orientation:portrait)]:h-[clamp(22rem,68vh,40rem)] [@media_(orientation:portrait)]:w-[clamp(15rem,78vw,28rem)]"
                    : "h-[clamp(9rem,24vh,15rem)] w-[clamp(16rem,40vw,30rem)] [@media_(orientation:portrait)]:h-[clamp(10rem,28vh,16rem)] [@media_(orientation:portrait)]:w-[clamp(14rem,72vw,24rem)]",
            )}
        >
            <Text variant="eyebrow">{label}</Text>

            <div className="min-h-0 overflow-hidden">
                {view === "readme" ? (
                    <MarkdownRenderer
                        content={readmeContent}
                        contentClassName="py-1"
                        highlightedHtml={readmeHighlightedHtml}
                        markdownHtml={readmeHtml}
                        rawContentClassName="py-1"
                    />
                ) : (
                    <ProjectDetails
                        languages={languages}
                        repository={repository}
                    />
                )}
            </div>

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
        <div className="flex h-full min-h-0 flex-col gap-4">
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

            <a
                className="mt-auto text-xs uppercase tracking-widest text-blue-500 hover:underline"
                href={repository.html_url}
                rel="noreferrer"
                target="_blank"
            >
                {t("viewRepository")}
            </a>
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
