"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Converts a subset of Markdown to HTML.
 * Handles the most common Notion export patterns.
 */
function markdownToHtml(md: string): string {
  let html = md;

  // ── Protect fenced code blocks ───────────────────────────────────
  const codeBlocks: string[] = [];
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, lang: string, code: string) => {
      const idx = codeBlocks.length;
      const escaped = escapeHtml(code.trimEnd());
      codeBlocks.push(
        `<pre><code class="${lang ? `language-${lang}` : ""}">${escaped}</code></pre>`
      );
      return `%%CODEBLOCK_${idx}%%`;
    }
  );

  // ── Protect inline code ──────────────────────────────────────────
  const inlineCodes: string[] = [];
  html = html.replace(/`([^`]+)`/g, (_match, code: string) => {
    const idx = inlineCodes.length;
    inlineCodes.push(`<code>${escapeHtml(code)}</code>`);
    return `%%INLINECODE_${idx}%%`;
  });

  // ── Protect HTML blocks (details, etc.) ──────────────────────────
  const htmlBlocks: string[] = [];
  html = html.replace(
    /<(details|summary|figure|figcaption)[\s\S]*?<\/\1>/gi,
    (match) => {
      const idx = htmlBlocks.length;
      htmlBlocks.push(match);
      return `%%HTMLBLOCK_${idx}%%`;
    }
  );

  // ── Images ───────────────────────────────────────────────────────
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
    return `<img src="${src}" alt="${escapeHtml(alt)}" class="rounded-lg max-w-full" />`;
  });

  // ── Headings ─────────────────────────────────────────────────────
  html = html.replace(/^#### (.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^### (.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^## (.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^# (.+)$/gm, "<h1>$1</h1>");

  // ── Horizontal rules ─────────────────────────────────────────────
  html = html.replace(/^---$/gm, "<hr />");

  // ── Blockquotes ──────────────────────────────────────────────────
  html = html.replace(/^> (.*)$/gm, (_, text: string) => {
    return `%%QUOTE_START%%${text}%%QUOTE_END%%`;
  });

  // ── Task lists ───────────────────────────────────────────────────
  html = html.replace(
    /^- \[(x| )\] (.+)$/gm,
    (_, checked: string, text: string) => {
      const isChecked = checked === "x";
      return `<li class="flex items-start gap-2"><span class="inline-flex items-center justify-center w-5 h-5 mt-0.5 border rounded ${isChecked ? "bg-primary border-primary" : "border-gray-300"}"><span class="${isChecked ? "text-white text-xs" : "hidden"}">&#10003;</span></span><span${isChecked ? ' class="line-through text-muted-foreground"' : ""}>${text}</span></li>`;
    }
  );

  // ── Tables ───────────────────────────────────────────────────────
  html = html.replace(
    /^\|(.+)\|\n\|[-: |]+\|\n((?:\|.+\|\n?)*)/gm,
    (_match, headerRow: string, bodyRows: string) => {
      const headers = headerRow
        .split("|")
        .map((h: string) => h.trim())
        .filter(Boolean);
      const headerHtml = headers
        .map((h: string) => `<th>${h}</th>`)
        .join("");
      const rows = bodyRows.split("\n").filter(Boolean);
      const bodyHtml = rows
        .map((row: string) => {
          const cells = row
            .replace(/^\||\|$/g, "")
            .split("|")
            .map((c) => c.trim());
          return `<tr>${cells.map((c: string) => `<td>${c}</td>`).join("")}</tr>`;
        })
        .join("");
      return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
    }
  );

  // ── Unordered lists ──────────────────────────────────────────────
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");

  // ── Ordered lists ────────────────────────────────────────────────
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  // ── Links ────────────────────────────────────────────────────────
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
  );

  // ── Bold ─────────────────────────────────────────────────────────
  html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");

  // ── Italic ───────────────────────────────────────────────────────
  html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");

  // ── Strikethrough ────────────────────────────────────────────────
  html = html.replace(/~~([^~]+)~~/g, "<del>$1</del>");

  // ── Wrap consecutive <li> elements in <ul>/<ol> ──────────────────
  html = html.replace(
    /((?:<li[^>]*>[\s\S]*?<\/li>\s*)+)/g,
    (match: string) => {
      return `<ul>${match.trim()}</ul>`;
    }
  );

  // ── Blockquote wrapping ──────────────────────────────────────────
  html = html.replace(
    /(?:%%QUOTE_START%%(.*?)%%QUOTE_END%%\s*)+/g,
    (match: string) => {
      const inner = match
        .replace(/%%QUOTE_START%%/g, "")
        .replace(/%%QUOTE_END%%/g, "<br />");
      return `<blockquote><p>${inner.trim()}</p></blockquote>`;
    }
  );

  // ── Paragraphs ───────────────────────────────────────────────────
  // Convert double newlines into paragraph breaks
  html = html.replace(/\n\n+/g, "</p><p>");
  html = `<p>${html}</p>`;
  html = html.replace(/<p>\s*<\/p>/g, "");

  // ── Restore code blocks ──────────────────────────────────────────
  html = html.replace(/%%CODEBLOCK_(\d+)%%/g, (_m, idx: string) => {
    return codeBlocks[Number.parseInt(idx)] || "";
  });

  // ── Restore inline code ──────────────────────────────────────────
  html = html.replace(/%%INLINECODE_(\d+)%%/g, (_m, idx: string) => {
    return inlineCodes[Number.parseInt(idx)] || "";
  });

  // ── Restore HTML blocks ──────────────────────────────────────────
  html = html.replace(/%%HTMLBLOCK_(\d+)%%/g, (_m, idx: string) => {
    return htmlBlocks[Number.parseInt(idx)] || "";
  });

  // ── Clean up ─────────────────────────────────────────────────────
  html = html.replace(/\n/g, " ");

  return html;
}

interface MdxPreviewProps {
  content: string;
  className?: string;
}

function HtmlPreview({ html, className }: { html: string; className?: string }) {
  // biome-ignore lint/security/noDangerouslySetInnerHtml: markdown preview for developer tool
  return <div className={className} dangerouslySetInnerHTML={{ __html: html }} />;
}

export function MdxPreview({ content, className }: MdxPreviewProps) {
  const html = useMemo(() => markdownToHtml(content), [content]);
  return (
    <HtmlPreview
      html={html}
      className={cn("prose prose-lg dark:prose-invert max-w-none", className)}
    />
  );
}

export function MdxRawPreview({ content }: { content: string }) {
  return (
    <pre className="p-4 bg-black/5 dark:bg-white/5 rounded-xl border border-black/10 dark:border-white/10 overflow-auto font-mono text-sm whitespace-pre-wrap leading-relaxed text-foreground/80 max-h-[60vh]">
      <code>{content}</code>
    </pre>
  );
}
