import type { ReactNode } from "react";

import { ProjectsLayoutContent } from "@/features/projects/components/projects-layout";

// Persists the spinning enso across /projects and /projects/[slug]; the active
// project's content renders into the centered orbit item via children.
export default function ProjectsLayout({ children }: { children: ReactNode }) {
    return <ProjectsLayoutContent>{children}</ProjectsLayoutContent>;
}
