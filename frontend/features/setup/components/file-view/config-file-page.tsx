import { notFound } from "next/navigation";

import { highlightCode } from "@/components/content-renderer/highlight-code";
import { renderMarkdownToHtml } from "@/components/content-renderer/render-markdown";
import { ConfigFileView } from "@/features/setup/components/file-view/config-file-view";
import { ConfigFolderState } from "@/features/setup/components/file-view/config-folder-state";
import { getVisibleConfigs } from "@/features/setup/lib/configs";
import { getDotfilesFileContent } from "@/lib/github";

interface ConfigFilePageProps {
    slug: string;
    // Catch-all segments of the file path under the config folder.
    file: string[];
}

export async function ConfigFilePage({ slug, file }: ConfigFilePageProps) {
    const configs = await getVisibleConfigs();
    const config = configs.find((item) => item.slug === slug);

    if (!config) notFound();

    const relativePath = file.map(decodeURIComponent).join("/");
    const fileName = relativePath.split("/").at(-1) ?? relativePath;
    const path = `${config.path}/${relativePath}`;

    let content: string;
    try {
        content = await getDotfilesFileContent(path);
    } catch {
        // The GitHub contents endpoint returns a directory (not a file) for a
        // folder path — surface a folder state instead of erroring.
        return <ConfigFolderState folderName={fileName} path={path} />;
    }

    const { highlightedHtml } = await highlightCode(content, path);
    const markdownHtml = path.toLowerCase().endsWith(".md")
        ? renderMarkdownToHtml(content)
        : null;

    return (
        <ConfigFileView
            fileName={fileName}
            path={path}
            content={content}
            highlightedHtml={highlightedHtml}
            markdownHtml={markdownHtml}
        />
    );
}
