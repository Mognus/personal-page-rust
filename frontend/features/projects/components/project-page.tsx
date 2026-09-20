import { notFound } from "next/navigation";

import { highlightCode } from "@/components/content-renderer/highlight-code";
import { renderMarkdownToHtml } from "@/components/content-renderer/render-markdown";
import { ProjectPageContent } from "@/features/projects/components/project-page-content";
import { projects } from "@/features/projects/lib/projects";
import {
    getRepository,
    getRepositoryFileContent,
    getRepositoryLanguages,
} from "@/lib/github";

interface ProjectPageProps {
    project: string;
}

export async function ProjectPage({ project }: ProjectPageProps) {
    // Resolve slug → repo via the curated list (shares the layout's cached fetch).
    const projectConfig = projects.find((item) => item.slug === project);

    if (!projectConfig) notFound();

    const [repository, readmeContent, languages] = await Promise.all([
        getRepository(projectConfig.full_name),
        getRepositoryFileContent(projectConfig.full_name, "README.md"),
        getRepositoryLanguages(projectConfig.full_name),
    ]);

    const { highlightedHtml: readmeHighlightedHtml } = await highlightCode(
        readmeContent,
        "README.md",
    );

    return (
        <ProjectPageContent
            label={projectConfig.label}
            readmeContent={readmeContent}
            readmeHighlightedHtml={readmeHighlightedHtml}
            readmeHtml={renderMarkdownToHtml(readmeContent)}
            repository={repository}
            languages={languages}
        />
    );
}
