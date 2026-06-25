import { notFound } from "next/navigation";

import { Text } from "@/components/typography/text";
import { getVisibleConfigs } from "@/features/setup/lib/configs";
import { Link } from "@/i18n/navigation";

interface Props {
    params: Promise<{ config: string }>;
}

// Placeholder panel that renders into the morphed grid cell. Checkpoint D
// replaces this with the real file view (tree + viewer).
export default async function ConfigPage({ params }: Props) {
    const { config: slug } = await params;
    const configs = await getVisibleConfigs();
    const config = configs.find((item) => item.slug === slug);

    if (!config) notFound();

    return (
        <div className="flex h-full min-h-0 flex-col gap-4 border border-foreground/30 p-6">
            <Text as="h1" variant="headingMd" className="uppercase">
                {config.label}
            </Text>
            <Text variant="bodyMuted" className="font-mono">
                {config.path}
            </Text>
            <Link
                href="/personal-setup"
                className="mt-auto text-xs tracking-widest text-foreground/60 uppercase hover:text-foreground"
            >
                Back
            </Link>
        </div>
    );
}
