import type { GithubEntry } from "@/lib/github";

export interface FileTreeNode {
    name: string;
    relativePath: string;
    path: string | null;
    sha: string;
    type: "file" | "dir";
    children: FileTreeNode[];
}

interface MutableFileTreeNode extends Omit<FileTreeNode, "children"> {
    children: MutableFileTreeNode[];
    childMap: Map<string, MutableFileTreeNode>;
}

// Strips the config's folder prefix so paths read relative to the config root.
export function getRelativePath(configPath: string, filePath: string) {
    const prefix = configPath.endsWith("/") ? configPath : `${configPath}/`;
    return filePath.startsWith(prefix) ? filePath.slice(prefix.length) : filePath;
}

export function getFileHref(slug: string, configPath: string, filePath: string) {
    const relativePath = getRelativePath(configPath, filePath);
    const encodedPath = relativePath.split("/").map(encodeURIComponent).join("/");

    return `/personal-setup/${slug}/${encodedPath}`;
}

export function isActiveFilePath(pathname: string, href: string) {
    return trimTrailingSlash(pathname) === trimTrailingSlash(href);
}

// Builds a nested tree from the flat GithubEntry list, relative to configPath.
export function buildFileTree(
    files: GithubEntry[],
    configPath: string,
): FileTreeNode[] {
    const root: MutableFileTreeNode = {
        name: "",
        relativePath: "",
        path: null,
        sha: "root",
        type: "dir",
        children: [],
        childMap: new Map(),
    };

    files.forEach((file) => {
        const relativePath = getRelativePath(configPath, file.path);
        const parts = relativePath.split("/").filter(Boolean);
        let currentNode = root;

        parts.forEach((part, index) => {
            const isFile = index === parts.length - 1;
            const nodePath = parts.slice(0, index + 1).join("/");
            const existingNode = currentNode.childMap.get(part);

            if (existingNode) {
                currentNode = existingNode;
                return;
            }

            const node: MutableFileTreeNode = {
                name: part,
                relativePath: nodePath,
                path: isFile ? file.path : null,
                sha: isFile ? file.sha : nodePath,
                type: isFile ? "file" : "dir",
                children: [],
                childMap: new Map(),
            };

            currentNode.childMap.set(part, node);
            currentNode.children.push(node);
            currentNode = node;
        });
    });

    return root.children.map(cleanTreeNode).sort(sortTreeNodes);
}

function cleanTreeNode(node: MutableFileTreeNode): FileTreeNode {
    return {
        name: node.name,
        relativePath: node.relativePath,
        path: node.path,
        sha: node.sha,
        type: node.type,
        children: node.children.map(cleanTreeNode).sort(sortTreeNodes),
    };
}

function sortTreeNodes(a: FileTreeNode, b: FileTreeNode) {
    if (a.type !== b.type) return a.type === "dir" ? -1 : 1;
    return a.name.localeCompare(b.name);
}

function trimTrailingSlash(path: string) {
    return path.length > 1 ? path.replace(/\/$/, "") : path;
}
