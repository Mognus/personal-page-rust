import type { ReactNode } from "react";

import { Text } from "@/components/typography/text";

interface SelectedFileHeaderProps {
    label: string;
    children?: ReactNode;
}

export function SelectedFileHeader({ label, children }: SelectedFileHeaderProps) {
    return (
        <div className="flex items-center justify-between gap-4">
            <Text variant="eyebrow">{label}</Text>
            {children}
        </div>
    );
}
