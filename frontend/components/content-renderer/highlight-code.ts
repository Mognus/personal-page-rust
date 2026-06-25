import "server-only";

import { codeToHtml, type BundledLanguage } from "shiki";

const SHIKI_THEMES = {
    light: "github-light",
    dark: "github-dark",
} as const;

function getLanguageFromPath(path: string): BundledLanguage | null {
    const fileName = path.split("/").pop()?.toLowerCase() ?? "";

    if (fileName === ".zshrc") return "zsh";
    if (fileName.endsWith(".sh")) return "bash";
    if (fileName === ".tmux.conf") return "bash";
    if (fileName === ".gitconfig" || fileName.endsWith(".conf") || fileName.endsWith(".ini")) return "ini";
    if (fileName.endsWith(".toml")) return "toml";
    if (fileName.endsWith(".json")) return "json";
    if (fileName.endsWith(".yaml") || fileName.endsWith(".yml")) return "yaml";
    if (fileName.endsWith(".css")) return "css";
    if (fileName.endsWith(".html")) return "html";
    if (fileName.endsWith(".md")) return "markdown";
    if (fileName.endsWith(".xml")) return "xml";

    return null;
}

export async function highlightCode(content: string, path: string) {
    const language = getLanguageFromPath(path);

    if (!language) {
        return {
            highlightedHtml: null,
            language: null,
        };
    }

    try {
        const highlightedHtml = await codeToHtml(content, {
            lang: language,
            themes: SHIKI_THEMES,
        });

        return {
            highlightedHtml,
            language,
        };
    } catch {
        return {
            highlightedHtml: null,
            language,
        };
    }
}
