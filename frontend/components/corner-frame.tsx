import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

// One L-shaped corner bracket; the two visible borders are set by the caller
// (e.g. "top-0 left-0 border-t-2 border-l-2").
function Corner({ className }: { className?: string }) {
    return (
        <span
            aria-hidden
            className={cn(
                "pointer-events-none absolute size-3 border-foreground/40 transition-colors group-hover:border-foreground",
                className,
            )}
        />
    );
}

// HUD corner brackets framing the children; the corners light up on hover of
// this wrapper (it's the `group`). Fill, layout and size come from the caller's
// className — this only owns the frame.
export function CornerFrame({
    className,
    children,
}: {
    className?: string;
    children: ReactNode;
}) {
    return (
        <div className={cn("group relative", className)}>
            <Corner className="top-0 left-0 border-t-2 border-l-2" />
            <Corner className="top-0 right-0 border-t-2 border-r-2" />
            <Corner className="bottom-0 left-0 border-b-2 border-l-2" />
            <Corner className="bottom-0 right-0 border-b-2 border-r-2" />
            {children}
        </div>
    );
}
