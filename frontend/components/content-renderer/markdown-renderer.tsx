"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { HighlightedRenderer } from "@/components/content-renderer/highlighted-renderer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./content-renderer.css";

interface MarkdownRendererProps {
    content: string;
    contentClassName?: string;
    highlightedHtml?: string | null;
    markdownHtml: string;
    rawContentClassName?: string;
}

// Compact text toggle (rendered/raw) built on the shared Button; active is muted
// off, foreground on. Replaces the old project's TextActionButton.
function ToggleButton({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClick}
            className={cn(
                "px-0 tracking-widest",
                active ? "text-foreground" : "text-muted-foreground",
            )}
        >
            {children}
        </Button>
    );
}

export function MarkdownRenderer({
    contentClassName,
    highlightedHtml,
    markdownHtml,
    rawContentClassName,
}: MarkdownRendererProps) {
    const t = useTranslations("ContentRenderer");
    const [view, setView] = useState<"rendered" | "raw">("rendered");
    const canRenderRaw = Boolean(highlightedHtml);

    return (
        <div className="flex h-full min-h-0 flex-1 flex-col">
            <div className="flex items-center gap-4 border-b border-foreground/10 py-3">
                <ToggleButton
                    active={view === "rendered"}
                    onClick={() => setView("rendered")}
                >
                    {t("rendered")}
                </ToggleButton>
                {canRenderRaw && (
                    <ToggleButton
                        active={view === "raw"}
                        onClick={() => setView("raw")}
                    >
                        {t("raw")}
                    </ToggleButton>
                )}
            </div>

            <div className="min-h-0 flex-1 overflow-auto">
                {view === "raw" && highlightedHtml ? (
                    <HighlightedRenderer
                        contentClassName={rawContentClassName}
                        html={highlightedHtml}
                    />
                ) : (
                    <div
                        className={cn(
                            "content-renderer-markdown",
                            contentClassName,
                        )}
                        dangerouslySetInnerHTML={{ __html: markdownHtml }}
                    />
                )}
            </div>
        </div>
    );
}
