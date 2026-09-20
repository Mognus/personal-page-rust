import { getTranslations } from "next-intl/server";

import { Text } from "@/components/typography/text";

// Placeholder route: the nav entry exists so the section is visible, but there
// are no posts yet. Replace the body once there is something to list.
export default async function Blog() {
    const t = await getTranslations("Blog");

    return (
        <div className="flex h-full flex-col items-center justify-center gap-4">
            <Text variant="eyebrowMuted">{t("title")}</Text>
            <Text variant="headingLg" className="tracking-[0.3em] uppercase">
                {t("comingSoon")}
            </Text>
        </div>
    );
}
