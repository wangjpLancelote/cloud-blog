"use client";

import { useEffect, useRef, useState } from "react";
import { MarkdownContent } from "./MarkdownContent";
import { formatSelection, type TextFormat } from "@/lib/writing-format";

type Published = { path: string; url: string };
const formats: [TextFormat, string, string][] = [
  ["bold", "B", "粗体"],
  ["italic", "I", "斜体"],
  ["strike", "S", "删除线"],
  ["h2", "H2", "二级标题"],
  ["h3", "H3", "三级标题"],
  ["quote", "❞", "引用"],
  ["bullet", "• 列表", "无序列表"],
  ["ordered", "1. 列表", "有序列表"],
  ["code", "</>", "行内代码"],
  ["link", "↗", "插入链接"],
  ["rule", "—", "分隔线"],
];

export function BlogWriter({ onDirtyChange }: { onDirtyChange: (dirty: boolean) => void }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [preview, setPreview] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [published, setPublished] = useState<Published | null>(null);
  const editor = useRef<HTMLTextAreaElement>(null);
  const requestId = useRef<string | null>(null);
  const locked = useRef(false);
  const selection = useRef({ start: 0, end: 0 });
  const dirty = !!(title.trim() || body.trim() || description.trim() || tags.trim());
  useEffect(() => onDirtyChange(dirty), [dirty, onDirtyChange]);

  const applyFormat = (format: TextFormat) => {
    if (publishing) return;
    const change = formatSelection(body, selection.current.start, selection.current.end, format);
    setBody(change.value);
    selection.current = { start: change.start, end: change.end };
    requestAnimationFrame(() => {
      editor.current?.focus();
      editor.current?.setSelectionRange(change.start, change.end);
    });
  };
  const publish = async () => {
    if (locked.current) return;
    if (!title.trim() || !body.trim()) {
      setError("请填写标题和正文后再发布。");
      return;
    }
    locked.current = true;
    setPublishing(true);
    setError("");
    requestId.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/publish-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: requestId.current,
          title,
          body,
          description,
          tags: tags
            .split(/[,，]/)
            .map((tag) => tag.trim())
            .filter(Boolean),
        }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "发布失败，请重试。");
      onDirtyChange(false);
      setPublished(result);
      setTitle("");
      setBody("");
      setDescription("");
      setTags("");
      requestId.current = null;
    } catch (err) {
      setError(err instanceof Error ? err.message : "发布失败，内容仍保留在编辑器中。");
    } finally {
      locked.current = false;
      setPublishing(false);
    }
  };
  if (published)
    return (
      <section className="writer-success" aria-live="polite">
        <span className="eyebrow">PUBLISHED</span>
        <h2>随笔已发布</h2>
        <p>文章已加入首页列表。</p>
        <p className="writer-file">{published.path}</p>
        <div className="writer-success-actions">
          {/* Full navigation reloads the newly written filesystem-backed article list. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a href="/">返回首页</a>
          <a href={published.url}>阅读文章 ↗</a>
          <button type="button" onClick={() => setPublished(null)}>
            再写一篇
          </button>
        </div>
      </section>
    );
  return (
    <section className="blog-writer">
      <header className="writer-heading">
        <div>
          <h1>写一篇随笔</h1>
          <p>记录一个念头，或今天值得留下的小事。</p>
        </div>
        <button type="button" className="writer-publish" disabled={publishing} onClick={publish}>
          {publishing ? "正在发布…" : "发布到首页"}
        </button>
      </header>
      <fieldset disabled={publishing} className="writer-fields">
        <label htmlFor="writing-title">标题</label>
        <input
          id="writing-title"
          className="writer-title"
          maxLength={120}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="给这篇随笔起个名字"
        />
        <div className="writer-metadata">
          <div>
            <label htmlFor="writing-summary">摘要（可选）</label>
            <input
              id="writing-summary"
              maxLength={300}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="留空时自动从正文提取"
            />
          </div>
          <div>
            <label htmlFor="writing-tags">标签（可选）</label>
            <input
              id="writing-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="生活，思考；默认标签为随笔"
            />
          </div>
        </div>
        <div className="writer-editor-head">
          <label htmlFor="writing-body">正文</label>
          <button type="button" aria-pressed={preview} onClick={() => setPreview(!preview)}>
            {preview ? "继续编辑" : "预览排版"}
          </button>
        </div>
        {!preview && (
          <fieldset className="writer-toolbar" aria-label="文字格式">
            {formats.map(([format, label, name]) => (
              <button
                key={format}
                type="button"
                title={name}
                aria-label={name}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => applyFormat(format)}
                className={`format-${format}`}
              >
                {label}
              </button>
            ))}
          </fieldset>
        )}
        {preview ? (
          <div className="writer-preview article-prose prose">
            <MarkdownContent content={body || "还没有正文，回到编辑开始写作吧。"} />
          </div>
        ) : (
          <textarea
            ref={editor}
            id="writing-body"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            onSelect={(e) => {
              selection.current = {
                start: e.currentTarget.selectionStart,
                end: e.currentTarget.selectionEnd,
              };
            }}
            onKeyDown={(e) => {
              if ((e.metaKey || e.ctrlKey) && ["b", "i"].includes(e.key.toLowerCase())) {
                e.preventDefault();
                applyFormat(e.key.toLowerCase() === "b" ? "bold" : "italic");
              }
            }}
            placeholder="从这里开始。选中文字后使用上方工具栏调整格式，也可以直接写 Markdown。"
          />
        )}
        <div className="writer-footnote">
          <span>{body.replace(/\s/g, "").length} 字</span>
          <span>不保存草稿 · 发布后生成 Markdown 文件</span>
        </div>
      </fieldset>
      {error && (
        <p className="writer-error" role="alert">
          {error}
        </p>
      )}
    </section>
  );
}
