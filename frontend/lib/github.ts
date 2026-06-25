import "server-only";

// Minimal GitHub API client for the public projects view. Live repo metadata
// (description, languages, README) is fetched here so it never goes stale in our
// DB — the DB only stores which repos to feature (see features/projects). This
// is a separate service from our backend, so it does NOT use callApi: different
// base URL, its own token (not the user JWT), and its own caching policy.
const GITHUB_API = "https://api.github.com";
const TOKEN = process.env.GITHUB_TOKEN;

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

interface GithubFileContent {
    content: string; // base64 encoded
    encoding: string;
    download_url: string;
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
