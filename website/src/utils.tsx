import { marked } from "marked";
import sanitizeHtml from "sanitize-html";

interface FetchMarkdownContentResult {
  htmlContent: string;
  error: string | null;
}

export async function fetchMarkdownContent(
  url: string,
): Promise<FetchMarkdownContentResult> {
  let htmlContent = "";
  let error: string | null = null;

  try {
    const response = await fetch(url);

    if (response.ok) {
      const markdownContent = await response.text();
      // Convert Markdown to HTML and sanitize
      htmlContent = sanitizeHtml(marked.parse(markdownContent), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat([
          "h1",
          "h2",
          "h3",
        ]),
      });
    } else {
      error = `Failed to load content: ${response.status} ${response.statusText}`;
    }
  } catch (e) {
    error = `Error loading content: ${(e as Error).message}`;
  }

  return { htmlContent, error };
}
