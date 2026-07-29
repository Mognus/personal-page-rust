import "server-only";

import { codeToHtml, type BundledLanguage } from "shiki";

const SHIKI_THEMES = {
    light: "github-light",
    dark: "github-dark",
} as const;

const LANGUAGE_BY_FILE_NAME: Record<string, BundledLanguage> = {
    ".gitconfig": "ini",
    ".tmux.conf": "bash",
    ".zshrc": "zsh",
    dunstrc: "ini",
    qmldir: "qml",
    "tmux.conf": "bash",
};

const LANGUAGE_BY_EXTENSION: Record<string, BundledLanguage> = {
    ".cjs": "javascript",
    ".conf": "ini",
    ".css": "css",
    ".fish": "fish",
    ".htm": "html",
    ".html": "html",
    ".ini": "ini",
    ".js": "javascript",
    ".json": "json",
    ".lua": "lua",
    ".markdown": "markdown",
    ".md": "markdown",
    ".mjs": "javascript",
    ".qml": "qml",
    ".sh": "bash",
    ".toml": "toml",
    ".xml": "xml",
    ".yaml": "yaml",
    ".yml": "yaml",
};

function getLanguageFromPath(path: string): BundledLanguage | null {
    const fileName = path.split("/").pop()?.toLowerCase() ?? "";
    const exactLanguage = LANGUAGE_BY_FILE_NAME[fileName];
    if (exactLanguage) return exactLanguage;

    const extensionStart = fileName.lastIndexOf(".");
    if (extensionStart < 0) return null;

    return LANGUAGE_BY_EXTENSION[fileName.slice(extensionStart)] ?? null;
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
