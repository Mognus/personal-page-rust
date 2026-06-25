import { getTranslations } from "next-intl/server";

import { Text } from "@/components/typography/text";
import { BackLink } from "@/features/setup/components/file-view/back-link";
import { SelectedFileHeader } from "@/features/setup/components/file-view/selected-file-header";

interface ConfigFolderStateProps {
    folderName: string;
    path: string;
}

// Shown when the selected path is a folder, not a file (GitHub content fetch
// returns a directory): prompt to pick a file from it.
export async function ConfigFolderState({
    folderName,
    path,
}: ConfigFolderStateProps) {
    const t = await getTranslations("Setup");

    return (
        <div className="flex h-full flex-col gap-3">
            <SelectedFileHeader label={t("selectedFolder")}>
                <BackLink />
            </SelectedFileHeader>
            <Text as="h2" variant="headingSm" className="uppercase">
                {folderName}
            </Text>
            <Text variant="captionMuted" className="break-all">
                {path}
            </Text>
            <div className="flex min-h-0 flex-1 items-center justify-center text-center">
                <Text variant="bodyMuted">{t("selectFileFromFolder")}</Text>
            </div>
        </div>
    );
}
