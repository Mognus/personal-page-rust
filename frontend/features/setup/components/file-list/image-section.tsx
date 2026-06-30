"use client";

import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Text } from "@/components/typography/text";
import type { GithubEntry } from "@/lib/github";

interface ImageSectionProps {
    files: GithubEntry[];
    as?: "li" | "div";
}

// Image previews for a config: thumbnails served straight from the dotfiles
// repo (raw.githubusercontent download_url). Clicking one opens a fullscreen
// lightbox. Plain <img> on purpose — no next/image remote config needed.
export function ImageSection({ files, as: Component = "li" }: ImageSectionProps) {
    const t = useTranslations("Setup");
    const [active, setActive] = useState<GithubEntry | null>(null);

    if (files.length === 0) return null;

    return (
        <Component className="flex min-h-0 flex-col gap-2">
            <Text variant="headingSm" className="px-3 uppercase">
                {t("images")}
            </Text>
            <div className="grid grid-cols-2 gap-3 overflow-y-auto px-3 pb-1">
                {files.map((file) => (
                    <button
                        key={file.sha}
                        type="button"
                        onClick={() => setActive(file)}
                        className="group flex cursor-pointer flex-col gap-1 text-left"
                    >
                        <span className="relative aspect-video w-full overflow-hidden border border-foreground/20 transition-colors group-hover:border-foreground">
                            {file.download_url && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                    src={file.download_url}
                                    alt={file.name}
                                    loading="lazy"
                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                />
                            )}
                        </span>
                        <Text
                            as="span"
                            variant="captionMuted"
                            className="truncate transition-colors group-hover:text-foreground"
                            title={file.name}
                        >
                            {file.name}
                        </Text>
                    </button>
                ))}
            </div>

            {active?.download_url && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6 backdrop-blur-sm"
                    onClick={() => setActive(null)}
                >
                    <button
                        type="button"
                        onClick={() => setActive(null)}
                        aria-label={t("back")}
                        className="absolute top-4 right-4 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <X className="size-6" />
                    </button>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={active.download_url}
                        alt={active.name}
                        className="max-h-full max-w-full object-contain"
                    />
                </div>
            )}
        </Component>
    );
}
