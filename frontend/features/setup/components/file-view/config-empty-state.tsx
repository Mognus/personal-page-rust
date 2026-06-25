import { getTranslations } from "next-intl/server";

import { Text } from "@/components/typography/text";
import { BackLink } from "@/features/setup/components/file-view/back-link";
import { SelectedFileHeader } from "@/features/setup/components/file-view/selected-file-header";

// Shown when a config is open but no file is selected yet.
export async function ConfigEmptyState() {
    const t = await getTranslations("Setup");

    return (
        <div className="flex h-full flex-col gap-3">
            <SelectedFileHeader label={t("selectedFile")}>
                <BackLink />
            </SelectedFileHeader>
            <div className="flex min-h-0 flex-1 items-center justify-center">
                <Text variant="bodyMuted">{t("selectFile")}</Text>
            </div>
        </div>
    );
}
