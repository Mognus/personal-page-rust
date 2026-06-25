import { ProjectPage } from "@/features/projects/components/project-page";

interface Props {
    params: Promise<{ project: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
    const { project } = await params;

    return <ProjectPage project={project} />;
}
