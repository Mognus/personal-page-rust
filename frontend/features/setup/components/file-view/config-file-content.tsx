import { HighlightedRenderer } from "@/components/content-renderer/highlighted-renderer";
import { MarkdownRenderer } from "@/components/content-renderer/markdown-renderer";
import { PlainRenderer } from "@/components/content-renderer/plain-renderer";

interface ConfigFileContentProps {
    content: string;
    highlightedHtml?: string | null;
    markdownHtml?: string | null;
}

// Picks the renderer: markdown (rendered/raw toggle) → syntax-highlighted →
// plain text, depending on what the server produced for this file.
export function ConfigFileContent({
    content,
    highlightedHtml,
    markdownHtml,
}: ConfigFileContentProps) {
    return (
        <div className="flex min-h-0 flex-1 flex-col overflow-auto">
            {markdownHtml ? (
                <MarkdownRenderer
                    content={content}
                    contentClassName="p-1"
                    highlightedHtml={highlightedHtml}
                    markdownHtml={markdownHtml}
                    rawContentClassName="p-1"
                />
            ) : highlightedHtml ? (
                <HighlightedRenderer contentClassName="p-1" html={highlightedHtml} />
            ) : (
                <PlainRenderer content={content} contentClassName="p-1" />
            )}
        </div>
    );
}
