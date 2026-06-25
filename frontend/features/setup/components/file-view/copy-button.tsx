"use client";

import { useState } from "react";

import { Text } from "@/components/typography/text";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
    content: string;
    idleLabel: string;
    successLabel: string;
    className?: string;
}

// Minimal clipboard button: copies the file content and flips its label to the
// success state for a moment.
export function CopyButton({
    content,
    idleLabel,
    successLabel,
    className,
}: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(content);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // Clipboard can be blocked (permissions/insecure context); ignore.
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            className={cn("cursor-pointer", className)}
        >
            <Text
                as="span"
                variant="eyebrowMuted"
                className="tracking-widest transition-colors hover:text-foreground"
            >
                {copied ? successLabel : idleLabel}
            </Text>
        </button>
    );
}
