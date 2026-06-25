import type { ReactNode } from "react";

import { SetupGrid } from "@/features/setup/components/setup-grid";
import { getVisibleConfigs } from "@/features/setup/lib/configs";

// Persists the morphing grid across /personal-setup and /personal-setup/[slug];
// the active config's content renders into the expanded cell via children.
export default async function PersonalSetupLayout({
    children,
}: {
    children: ReactNode;
}) {
    const configs = await getVisibleConfigs();

    return <SetupGrid configs={configs}>{children}</SetupGrid>;
}
