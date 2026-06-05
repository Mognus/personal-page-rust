import * as React from "react";

import { cn } from "@/lib/utils";

const textVariants = {
    headingLg:
        "text-[clamp(1rem,1.6vw,1.5rem)] tracking-[0.12em] text-foreground",
    headingMd:
        "text-[clamp(0.8125rem,1.25vw,1.25rem)] tracking-[0.12em] text-foreground",
    headingSm:
        "text-[clamp(0.75rem,1vw,1rem)] tracking-[0.12em] text-foreground",
    headingXs:
        "text-[clamp(0.6875rem,0.9vw,0.875rem)] tracking-[0.12em] text-foreground",
    body: "text-[clamp(0.6875rem,0.9vw,0.875rem)] text-foreground",
    bodyMuted: "text-[clamp(0.6875rem,0.9vw,0.875rem)] text-muted-foreground",
    bodySubtle:
        "text-[clamp(0.6875rem,0.9vw,0.875rem)] text-muted-foreground/80",
    bodyFaint:
        "text-[clamp(0.6875rem,0.9vw,0.875rem)] text-muted-foreground/60",
    caption: "text-[clamp(0.5625rem,0.75vw,0.75rem)] text-foreground",
    captionMuted:
        "text-[clamp(0.5625rem,0.75vw,0.75rem)] text-muted-foreground",
    captionSubtle:
        "text-[clamp(0.5625rem,0.75vw,0.75rem)] text-muted-foreground/80",
    captionFaint:
        "text-[clamp(0.5625rem,0.75vw,0.75rem)] text-muted-foreground/60",
    eyebrow:
        "text-[clamp(0.5625rem,0.8vw,0.75rem)] tracking-widest uppercase text-foreground",
    eyebrowMuted:
        "text-[clamp(0.5625rem,0.8vw,0.75rem)] tracking-widest uppercase text-muted-foreground",
} as const;

type TextVariant = keyof typeof textVariants;

interface TextProps extends React.HTMLAttributes<HTMLElement> {
    active?: boolean;
    as?: React.ElementType;
    variant?: TextVariant;
}

export function Text({
    active = false,
    as: Component = "p",
    variant = "body",
    className,
    ...props
}: TextProps) {
    // createElement avoids the `never` prop inference that a polymorphic `as`
    // JSX element triggers under React 19's stricter types.
    return React.createElement(Component, {
        className: cn(
            textVariants[variant],
            active && "text-foreground",
            className,
        ),
        ...props,
    });
}
