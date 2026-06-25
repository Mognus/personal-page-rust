import "server-only";

function escapeHtml(value: string) {
    return value
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function renderInlineMarkdown(line: string) {
    return escapeHtml(line)
        .replace(/`([^`]+)`/g, "<code>$1</code>")
        .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
        .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

// Tiny, dependency-free markdown → HTML for repo READMEs. Handles headings,
// unordered lists, fenced code blocks, paragraphs, and inline code/bold/italic.
export function renderMarkdownToHtml(markdown: string) {
    const lines = markdown.split("\n");
    const html: string[] = [];
    let inList = false;
    let inCodeBlock = false;
    const paragraph: string[] = [];
    const codeLines: string[] = [];

    const flushParagraph = () => {
        if (!paragraph.length) return;
        html.push(`<p>${paragraph.map(renderInlineMarkdown).join(" ")}</p>`);
        paragraph.length = 0;
    };

    const flushList = () => {
        if (!inList) return;
        html.push("</ul>");
        inList = false;
    };

    const flushCodeBlock = () => {
        if (!inCodeBlock) return;
        html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
        codeLines.length = 0;
        inCodeBlock = false;
    };

    for (const line of lines) {
        if (line.trim().startsWith("```")) {
            flushParagraph();
            flushList();

            if (inCodeBlock) {
                flushCodeBlock();
            } else {
                inCodeBlock = true;
            }

            continue;
        }

        if (inCodeBlock) {
            codeLines.push(line);
            continue;
        }

        if (!line.trim()) {
            flushParagraph();
            flushList();
            continue;
        }

        const heading = line.match(/^(#{1,6})\s+(.*)$/);
        if (heading) {
            flushParagraph();
            flushList();
            const level = heading[1].length;
            html.push(`<h${level}>${renderInlineMarkdown(heading[2])}</h${level}>`);
            continue;
        }

        const listItem = line.match(/^\s*-\s+(.*)$/);
        if (listItem) {
            flushParagraph();
            if (!inList) {
                html.push("<ul>");
                inList = true;
            }
            html.push(`<li>${renderInlineMarkdown(listItem[1])}</li>`);
            continue;
        }

        paragraph.push(line.trim());
    }

    flushParagraph();
    flushList();
    flushCodeBlock();

    return html.join("");
}
