import DOMPurify from "dompurify";
import { marked } from "marked";

export function formatText(content) {
  // Configure marked to leave raw HTML intact and parse Markdown
  marked.setOptions({
    gfm: true, // GitHub-flavored Markdown
    breaks: true, // Allow line breaks
    smartLists: true, // Better list formatting
    renderer: new marked.Renderer({
      link: (href, title, text) => `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline">${text}</a>`
    })
  });

  const rawHtml = marked(content); // Convert Markdown to HTML
  return DOMPurify.sanitize(rawHtml); // Sanitize the HTML
}