import "server-only";

// Minimal GitHub API client for the public projects view. Live repo metadata
// (description, languages, README) is fetched here so it never goes stale in our
// DB — the DB only stores which repos to feature (see features/projects). This
// is a separate service from our backend, so it does NOT use callApi: different
// base URL, its own token (not the user JWT), and its own caching policy.
const GITHUB_API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN;

// Single dotfiles repo backing the personal-setup file view. Set this in the
// env (e.g. "Mognus/linux-dotfiles"); config entries store folder paths within it.
const DOTFILES_REPO = process.env.GITHUB_DOTFILES_REPO ?? "";

export interface GithubRepository {
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    homepage: string | null;
    language: string | null;
    topics: string[];
    updated_at: string;
    pushed_at: string;
}

export type GithubRepositoryLanguages = Record<string, number>;

// A flattened tree entry (file or dir) within the dotfiles repo.
export interface GithubEntry {
    name: string;
    path: string;
    type: "file" | "dir";
    download_url: string | null;
    sha: string;
}

interface GithubFileContent {
    content: string; // base64 encoded
    encoding: string;
    download_url: string;
}

interface GithubRepo {
    default_branch: string;
}

interface GithubTreeResponse {
    tree: GithubTreeEntry[];
}

interface GithubTreeEntry {
    path: string;
    type: "blob" | "tree" | "commit";
    sha: string;
}

async function githubFetch<T>(
    path: string,
    fetchOptions: RequestInit = {},
): Promise<T> {
    const headers = new Headers({ Accept: "application/vnd.github+json" });
    if (TOKEN) headers.set("Authorization", `Bearer ${TOKEN}`);

    const res = await fetch(`${GITHUB_API}${path}`, { ...fetchOptions, headers });
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${path}`);
    return res.json();
}

export async function getRepository(
    fullName: string,
    revalidate = 3600,
): Promise<GithubRepository> {
    return githubFetch<GithubRepository>(`/repos/${fullName}`, {
        next: { revalidate },
    });
}

export async function getRepositoryLanguages(
    fullName: string,
    revalidate = 3600,
): Promise<GithubRepositoryLanguages> {
    return githubFetch<GithubRepositoryLanguages>(
        `/repos/${fullName}/languages`,
        { next: { revalidate } },
    );
}

export async function getRepositoryFileContent(
    fullName: string,
    path: string,
    revalidate = 3600,
): Promise<string> {
    const file = await githubFetch<GithubFileContent>(
        `/repos/${fullName}/contents/${path}`,
        { next: { revalidate } },
    );

    return Buffer.from(file.content, "base64").toString("utf-8");
}

// Reads a single file from the configured dotfiles repo by repo-relative path.
export async function getDotfilesFileContent(
    path: string,
    revalidate = 3600,
): Promise<string> {
    return getRepositoryFileContent(DOTFILES_REPO, path, revalidate);
}

// Flattens the dotfiles repo tree under `folderPath` into file/dir entries. Uses
// the recursive git-tree API (one request) and keeps only the wanted subtree;
// submodules (type "commit") are dropped.
export async function getDotfilesTree(
    folderPath: string,
    revalidate = 3600,
): Promise<GithubEntry[]> {
    const repo = await githubFetch<GithubRepo>(`/repos/${DOTFILES_REPO}`, {
        next: { revalidate },
    });
    const tree = await githubFetch<GithubTreeResponse>(
        `/repos/${DOTFILES_REPO}/git/trees/${repo.default_branch}?recursive=1`,
        { next: { revalidate } },
    );

    const prefix = folderPath.replace(/\/$/, "");

    return tree.tree
        .filter((entry) => entry.path.startsWith(`${prefix}/`))
        .filter((entry) => entry.type === "blob" || entry.type === "tree")
        .map((entry) => ({
            name: entry.path.split("/").pop() ?? entry.path,
            path: entry.path,
            type: entry.type === "tree" ? "dir" : "file",
            download_url:
                entry.type === "blob"
                    ? `https://raw.githubusercontent.com/${DOTFILES_REPO}/${repo.default_branch}/${entry.path}`
                    : null,
            sha: entry.sha,
        }));
}
