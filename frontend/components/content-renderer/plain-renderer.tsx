import "./content-renderer.css";
import { cn } from "@/lib/utils";

interface PlainRendererProps {
    contentClassName?: string;
    content: string;
}

export function PlainRenderer({ content, contentClassName }: PlainRendererProps) {
    return (
        <pre className={cn("content-renderer-plain", contentClassName)}>
            <code>{content}</code>
        </pre>
    );
}
