"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/typography/text";
import { BackLink } from "@/features/setup/components/file-view/back-link";
import { ConfigFileContent } from "@/features/setup/components/file-view/config-file-content";
import { CopyButton } from "@/features/setup/components/file-view/copy-button";
import { SelectedFileHeader } from "@/features/setup/components/file-view/selected-file-header";

interface ConfigFileViewProps {
    fileName: string;
    path: string;
    content: string;
    highlightedHtml?: string | null;
    markdownHtml?: string | null;
}

export function ConfigFileView({
    fileName,
    path,
    content,
    highlightedHtml,
    markdownHtml,
}: ConfigFileViewProps) {
    const t = useTranslations("Setup");

    return (
        <div className="flex h-full flex-col gap-3">
            <SelectedFileHeader label={t("selectedFile")}>
                <div className="flex items-center gap-3">
                    <CopyButton
                        content={content}
                        idleLabel={t("copy")}
                        successLabel={t("copied")}
                    />
                    <BackLink />
                </div>
            </SelectedFileHeader>
            <Text as="h2" variant="headingSm" className="uppercase">
                {fileName}
            </Text>
            <Text variant="captionMuted" className="break-all">
                {path}
            </Text>
            <ConfigFileContent
                content={content}
                highlightedHtml={highlightedHtml}
                markdownHtml={markdownHtml}
            />
        </div>
    );
}
