import TurndownService from "turndown";
import { gfm } from "turndown-plugin-gfm";

let gService: TurndownService | null = null;

function getService(): TurndownService {
  if (gService) return gService;

  const td = new TurndownService({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
    blankReplacement: (_content, node) => {
      const el = node as { nodeName: string; style?: { display?: string }; textContent?: string; isBlock?: boolean };
      // Collapse empty layout containers to nothing
      if (el.nodeName === "DIV" || el.nodeName === "SPAN") {
        // If it's a flex container used for layout, just inline its children
        if (el.style?.display === "flex") return "";
        // If it's empty, remove
        if (!el.textContent?.trim()) return "";
      }
      return el.nodeName === "BR" ? "" : el.isBlock ? "\n\n" : "";
    },
  });

  td.use(gfm);

  // ── Notion Callouts ──────────────────────────────────────────────
  // Callouts are divs with border-radius, padding, background and a flex icon+content layout
  td.addRule("notionCallout", {
    filter: (node) => {
      if (node.nodeName !== "DIV") return false;
      const el = node as HTMLElement;
      const style = el.getAttribute("style") || "";
      return (
        style.includes("border-radius") &&
        style.includes("padding") &&
        style.includes("background") &&
        el.children.length >= 1
      );
    },
    replacement: (content, node) => {
      const el = node as HTMLElement;
      // The first child often holds the emoji/icon
      const children = Array.from(el.children);
      let emoji = "";
      let textContent = content;

      // Check if first child is a standalone emoji/icon container
      if (children.length >= 2) {
        const firstChild = children[0];
        const firstText = firstChild.textContent?.trim() || "";
        // If first child is purely a single emoji/symbol
        if (
          firstText.length <= 4 &&
                    /^(\p{Emoji}|\p{Emoji}\u200d\p{Emoji}|\p{Extended_Pictographic})+$/u.test(firstText)
        ) {
          emoji = `${firstText} `;
          // Rebuild content without the emoji container
          const remaining = children.slice(1);
          const tempDiv = document.createElement("div");
          for (const c of remaining) {
            tempDiv.appendChild(c.cloneNode(true));
          }
          textContent = td.turndown(tempDiv).trim();
        }
      }

      // Convert to blockquote: prefix each line with "> "
      const lines = textContent
        .split("\n")
        .map((line) => (line ? `> ${line}` : ">"))
        .join("\n");

      return `\n\n> ${emoji}${lines.replace(/^> /, "")}\n\n`;
    },
  });

  // ── Notion Toggle Blocks ─────────────────────────────────────────
  // <details><summary>Title</summary>Content</details>
  // Keep as raw HTML in MDX since there's no markdown equivalent
  td.addRule("notionToggle", {
    filter: (node) => {
      return (
        node.nodeName === "DETAILS" &&
        !!node.querySelector("summary")
      );
    },
    replacement: (content, node) => {
      const el = node as HTMLElement;
      // Rebuild clean HTML without Notion's inline styles
      const summary = el.querySelector("summary");
      const summaryText = summary?.textContent?.trim() || "";

      // Get content excluding the summary
      let bodyContent = "";
      for (const child of Array.from(el.children)) {
        if (child.nodeName === "SUMMARY") continue;
        bodyContent += child.outerHTML;
      }

      return `\n\n<details>\n<summary>${summaryText}</summary>\n\n${td.turndown(bodyContent)}\n\n</details>\n\n`;
    },
  });

  // ── Inline Colored Text ──────────────────────────────────────────
  // <span style="color: ..."> → keep as HTML span
  td.addRule("notionColoredText", {
    filter: (node) => {
      if (node.nodeName !== "SPAN") return false;
      const style = (node as HTMLElement).getAttribute("style") || "";
      return style.includes("color") && !style.includes("display");
    },
    replacement: (content, node) => {
      const el = node as HTMLElement;
      const style = el.getAttribute("style") || "";
      return `<span style="${style}">${content}</span>`;
    },
  });

  // ── Figure → Plain Image ─────────────────────────────────────────
  td.addRule("figure", {
    filter: "figure",
    replacement: (content, node) => {
      const img = node.querySelector("img");
      const figcaption = node.querySelector("figcaption");

      if (!img) return content;

      const src = img.getAttribute("src") || "";
      const alt =
        img.getAttribute("alt") ||
        figcaption?.textContent?.trim() ||
        "";

      if (src) {
        return `\n\n![${alt}](${src})\n\n`;
      }
      return content;
    },
  });

  // ── Task Lists ───────────────────────────────────────────────────
  // GFM plugin handles <input type="checkbox"> in most cases,
  // but this ensures Notion's specific checkbox pattern works
  td.addRule("notionCheckbox", {
    filter: (node) => {
      if (node.nodeName !== "INPUT") return false;
      const el = node as HTMLInputElement;
      return el.type === "checkbox";
    },
    replacement: (_content, node) => {
      const el = node as HTMLInputElement;
      return el.checked ? "[x]" : "[ ]";
    },
  });

  // ── Empty Notion Layout Divs ─────────────────────────────────────
  // Notion uses nested empty divs for layout. Strip them.
  td.addRule("notionLayoutDiv", {
    filter: (node) => {
      if (node.nodeName !== "DIV") return false;
      const el = node as HTMLElement;
      const inner = el.innerHTML.trim();
      // If the div only contains other divs and no text, treat it as a layout wrapper
      if (!inner) return true;
      return false;
    },
    replacement: () => "",
  });

  // ── Clean Up Notion-Specific Attributes ──────────────────────────
  // Remove notion-specific data attributes and role attributes
  td.addRule("notionAttributes", {
    filter: (node) => {
      return (
        node.nodeType === 1 &&
        ((node as HTMLElement).hasAttribute("data-block-id") ||
          (node as HTMLElement).hasAttribute("spellcheck") ||
          (node as HTMLElement).getAttribute("role") === "region" ||
          !!(node as HTMLElement).className?.includes("notion"))
      );
    },
    replacement: (content) => content,
  });

  gService = td;
  return td;
}

/**
 * Cleans up converted markdown:
 * - Collapses excessive blank lines
 * - Normalizes trailing whitespace
 */
function polishMarkdown(md: string): string {
  return `${md
      // Collapse 3+ consecutive newlines into 2
      .replace(/\n{3,}/g, "\n\n")
      // Remove lines that are just spaces
      .replace(/\n[ \t]+\n/g, "\n\n")
      // Remove trailing whitespace on each line
      .replace(/[ \t]+$/gm, "")
      // Ensure single trailing newline
      .trim()}\n`;
}

/**
 * Parses Notion-exported HTML and converts it to clean Markdown/MDX.
 */
export function parseNotionHtml(html: string): string {
  const td = getService();
  let markdown = td.turndown(html);
  markdown = polishMarkdown(markdown);
  return markdown;
}

/**
 * Generates full MDX content with frontmatter.
 */
export function generateMdx({
  title,
  date,
  description,
  category,
  body,
}: {
  title: string;
  date?: string;
  description?: string;
  category?: string;
  body: string;
}): string {
  const lines: string[] = ["---"];
  lines.push(`title: "${title.replace(/"/g, '\\"')}"`);

  if (date) {
    lines.push(`date: "${date}"`);
  }

  if (description) {
    lines.push(
      `description: "${description.replace(/"/g, '\\"').replace(/\n/g, " ")}"`
    );
  }

  if (category) {
    lines.push(`category: "${category}"`);
  }

  lines.push("---");
  lines.push("");
  lines.push(body.trim());

  return lines.join("\n");
}
