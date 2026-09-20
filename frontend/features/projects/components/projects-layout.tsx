import type { ReactNode } from "react";

import { ProjectEnso } from "@/features/projects/components/project-enso";
import { projects as projectList, toOrbit } from "@/features/projects/lib/projects";

interface ProjectsLayoutContentProps {
    children: ReactNode;
}

// Server shell for the projects route: hands the orbit (href + derived angle)
// to the client enso. The children are the active project's content, slotted
// into the centered orbit item.
export function ProjectsLayoutContent({
    children,
}: ProjectsLayoutContentProps) {
    const projects = toOrbit(projectList);

    return (
        <div className="h-full overflow-hidden p-8">
            <ProjectEnso projects={projects}>{children}</ProjectEnso>
        </div>
    );
}
