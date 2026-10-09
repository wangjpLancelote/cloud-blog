export type TextFormat =
  | "bold"
  | "italic"
  | "strike"
  | "h2"
  | "h3"
  | "quote"
  | "bullet"
  | "ordered"
  | "code"
  | "link"
  | "rule";

export function formatSelection(value: string, start: number, end: number, format: TextFormat) {
  const wraps: Partial<Record<TextFormat, [string, string, string]>> = {
    bold: ["**", "**", "粗体文字"],
    italic: ["*", "*", "斜体文字"],
    strike: ["~~", "~~", "删除线文字"],
    code: ["`", "`", "代码"],
    link: ["[", "](https://example.com)", "链接文字"],
  };
  const wrap = wraps[format];
  if (wrap) {
    const selected = value.slice(start, end) || wrap[2];
    return {
      value: value.slice(0, start) + wrap[0] + selected + wrap[1] + value.slice(end),
      start: start + wrap[0].length,
      end: start + wrap[0].length + selected.length,
    };
  }
  if (format === "rule") {
    const insert = "\n\n---\n\n";
    return {
      value: value.slice(0, start) + insert + value.slice(end),
      start: start + insert.length,
      end: start + insert.length,
    };
  }
  const from = start === 0 ? 0 : value.lastIndexOf("\n", start - 1) + 1;
  const lineEnd = value.indexOf("\n", end);
  const to = lineEnd === -1 ? value.length : lineEnd;
  const prefixes: Partial<Record<TextFormat, string>> = {
    h2: "## ",
    h3: "### ",
    quote: "> ",
    bullet: "- ",
  };
  const selected = value.slice(from, to) || "文字";
  const inserted = selected
    .split("\n")
    .map(
      (line, index) =>
        `${format === "ordered" ? `${index + 1}. ` : prefixes[format]}${line.replace(/^(?:#{1,6}\s|>\s|[-*]\s|\d+\.\s)/, "")}`
    )
    .join("\n");
  return {
    value: value.slice(0, from) + inserted + value.slice(to),
    start: from,
    end: from + inserted.length,
  };
}
