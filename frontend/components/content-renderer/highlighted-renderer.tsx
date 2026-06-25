import "./content-renderer.css";
import { cn } from "@/lib/utils";

interface HighlightedRendererProps {
    contentClassName?: string;
    html: string;
}

export function HighlightedRenderer({
    contentClassName,
    html,
}: HighlightedRendererProps) {
    return (
        <div
            className={cn("content-renderer-highlight", contentClassName)}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}
