"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { parseNotionHtml, generateMdx } from "@/lib/notion-to-mdx";
import { extractImages, imageUrlToBase64, isNotionImage } from "@/lib/notion-images";
import { MdxPreview, MdxRawPreview } from "./MdxPreview";
import { Button } from "@/components/cloud-ui/button";
import { cn } from "@/lib/utils";
import {
  Copy,
  Download,
  FileText,
  Eye,
  ImageIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { ComponentType } from "react";

// Fix React 19 Lucide icon type compatibility
const IconCopy = Copy as unknown as ComponentType<{ className?: string }>;
const IconDownload = Download as unknown as ComponentType<{ className?: string }>;
const IconFileText = FileText as unknown as ComponentType<{ className?: string }>;
const IconEye = Eye as unknown as ComponentType<{ className?: string }>;
const IconImage = ImageIcon as unknown as ComponentType<{ className?: string }>;
const IconTrash = Trash2 as unknown as ComponentType<{ className?: string }>;
const IconAlertCircle = AlertCircle as unknown as ComponentType<{ className?: string }>;
const IconCheckCircle = CheckCircle2 as unknown as ComponentType<{ className?: string }>;

interface DetectedImage {
  url: string;
  alt: string;
  base64?: string;
  loading: boolean;
  error?: string;
}

type PreviewTab = "rendered" | "raw";

const CATEGORY_OPTIONS = ["Frontend", "Thoughts"];

export function NotionConverter({ onDirtyChange }: { onDirtyChange?: (dirty: boolean) => void } = {}) {
  const [pastedHtml, setPastedHtml] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageMode, setImageMode] = useState<"remote" | "base64">("remote");
  const [images, setImages] = useState<DetectedImage[]>([]);
  const [previewTab, setPreviewTab] = useState<PreviewTab>("rendered");
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "error">("idle");
  const [hasPasted, setHasPasted] = useState(false);
  const pasteTargetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onDirtyChange?.(!!(markdown.trim() || title.trim() || description.trim() || pastedHtml.trim()));
  }, [markdown, title, description, pastedHtml, onDirtyChange]);

  // Parse pasted HTML to markdown whenever it changes
  useEffect(() => {
    if (!pastedHtml) return;
    const md = parseNotionHtml(pastedHtml);
    setMarkdown(md);

    const extracted = extractImages(pastedHtml);
    setImages(
      extracted.map((img) => ({ ...img, loading: false }))
    );
  }, [pastedHtml]);

  // Extract title from first heading if not set
  useEffect(() => {
    if (title || !markdown) return;
    const match = markdown.match(/^# (.+)$/m);
    if (match) {
      setTitle(match[1]);
    }
  }, [markdown, title]);

  // Handle paste event to capture HTML from clipboard
  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      e.preventDefault();
      const html = e.clipboardData.getData("text/html");
      const text = e.clipboardData.getData("text/plain");

      if (html) {
        setPastedHtml(html);
        setHasPasted(true);
      } else if (text) {
        // Plain text paste - treat as raw markdown
        setPastedHtml("");
        setMarkdown(text);
        setHasPasted(true);
      }
    },
    []
  );

  // Update markdown when user edits it
  const handleMarkdownChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMarkdown(e.target.value);
    },
    []
  );

  // Generate final MDX with frontmatter
  const finalMdx = useMemo(() => {
    if (!markdown) return "";
    return generateMdx({
      title: title || "Untitled",
      date: date || undefined,
      description: description || undefined,
      category: category || undefined,
      body: markdown,
    });
  }, [markdown, title, date, description, category]);

  // Copy MDX to clipboard
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(finalMdx);
      setCopyStatus("copied");
      setTimeout(() => setCopyStatus("idle"), 2000);
    } catch {
      setCopyStatus("error");
      setTimeout(() => setCopyStatus("idle"), 3000);
    }
  }, [finalMdx]);

  // Download MDX file
  const handleDownload = useCallback(() => {
    const blob = new Blob([finalMdx], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "untitled";
    a.href = url;
    a.download = `${slug}.mdx`;
    a.click();
    URL.revokeObjectURL(url);
  }, [finalMdx, title]);

  // Convert images to base64
  const handleConvertToBase64 = useCallback(async () => {
    setImageMode("base64");
    setImages((prev) => prev.map((img) => ({ ...img, loading: true })));

    const updatedImages = [...images];
    for (let i = 0; i < updatedImages.length; i++) {
      try {
        const base64 = await imageUrlToBase64(updatedImages[i].url);
        updatedImages[i] = { ...updatedImages[i], base64, loading: false };
        setImages([...updatedImages]);
      } catch {
        updatedImages[i] = {
          ...updatedImages[i],
          loading: false,
          error: "Failed to load",
        };
        setImages([...updatedImages]);
      }
    }

    // Replace URLs in markdown with base64
    let updatedMd = markdown;
    for (const img of updatedImages) {
      if (img.base64) {
        updatedMd = updatedMd.replace(img.url, img.base64);
      }
    }
    setMarkdown(updatedMd);
  }, [images, markdown]);

  // Reset to remote URLs
  const handleUseRemote = useCallback(() => {
    setImageMode("remote");
    // Re-parse from original HTML to get clean markdown
    if (pastedHtml) {
      const md = parseNotionHtml(pastedHtml);
      setMarkdown(md);
      setImages((prev) =>
        prev.map((img) => ({ url: img.url, alt: img.alt, loading: false }))
      );
    }
  }, [pastedHtml]);

  // Clear everything
  const handleClear = useCallback(() => {
    setPastedHtml("");
    setMarkdown("");
    setTitle("");
    setDescription("");
    setImages([]);
    setHasPasted(false);
    setCategory("");
    setCopyStatus("idle");
    setImageMode("remote");
  }, []);

  // Build image display count
  const notionImageCount = images.filter((img) => isNotionImage(img.url)).length;
  const base64InProgress = images.some((img) => img.loading);
  const base64Errors = images.filter((img) => img.error).length;

  return (
    <div className="flex flex-col gap-5 font-sans">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground">
          Notion &rarr; MDX Converter
        </h1>
        <p className="text-sm text-muted-text">
          Paste Notion content below to convert it into MDX for your blog posts.
        </p>
      </div>

      {/* Paste Area (shown when no content) */}
      {!hasPasted && (
        <div
          ref={pasteTargetRef}
          contentEditable
          suppressContentEditableWarning
          onPaste={handlePaste}
          onInput={(e) => {
            // If user types, switch to plain text mode
            if (e.currentTarget.textContent) {
              setMarkdown(e.currentTarget.textContent);
              setHasPasted(true);
            }
          }}
          className={cn(
            "min-h-[200px] p-6 rounded-xl border-2 border-dashed cursor-text",
            "border-primary/30 bg-primary/[0.03] hover:border-primary/50",
            "transition-colors duration-200",
            "flex items-center justify-center text-center"
          )}
        >
          <div className="flex flex-col items-center gap-3 text-muted-text">
            <IconFileText className="w-10 h-10 opacity-30" />
            <div>
              <p className="font-medium text-foreground/70">
                Paste your Notion content here
              </p>
              <p className="text-sm mt-1">
                Open a Notion page, select all (<kbd className="px-1.5 py-0.5 text-xs bg-black/10 dark:bg-white/10 rounded">&#x2318;+A</kbd>), copy (<kbd className="px-1.5 py-0.5 text-xs bg-black/10 dark:bg-white/10 rounded">&#x2318;+C</kbd>), then click here and paste (<kbd className="px-1.5 py-0.5 text-xs bg-black/10 dark:bg-white/10 rounded">&#x2318;+V</kbd>)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main content (shown after paste) */}
      {hasPasted && (
        <>
          {/* Metadata fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label htmlFor="notion-title" className="text-sm font-medium text-foreground/70">
                Title <span className="text-destructive">*</span>
              </label>
              <input
                id="notion-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title"
                className="px-3 py-2 rounded-lg border border-border bg-white dark:bg-white/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="notion-date" className="text-sm font-medium text-foreground/70">
                Date
              </label>
              <input
                id="notion-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-white dark:bg-white/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="notion-category" className="text-sm font-medium text-foreground/70">
                Category
              </label>
              <select
                id="notion-category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="px-3 py-2 rounded-lg border border-border bg-white dark:bg-white/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <option value="">-- Select --</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="notion-desc" className="text-sm font-medium text-foreground/70">
                Description
              </label>
              <input
                id="notion-desc"
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description"
                className="px-3 py-2 rounded-lg border border-border bg-white dark:bg-white/5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>

          {/* Two-panel layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Editor panel */}
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground/70">
                  Editor
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="flex items-center gap-1 text-xs text-muted-text hover:text-destructive transition-colors"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                  Clear
                </button>
              </div>
              <textarea
                value={markdown}
                onChange={handleMarkdownChange}
                className="flex-1 min-h-[400px] p-4 rounded-xl border border-border bg-white dark:bg-white/5 text-foreground font-mono text-sm leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
                placeholder="Edit your markdown here..."
              />
            </div>

            {/* Preview panel */}
            <div className="flex flex-col gap-2 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground/70">
                  Preview
                </span>
                <div className="flex rounded-lg border border-border overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("rendered")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 text-xs transition-colors",
                      previewTab === "rendered"
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-text hover:text-foreground"
                    )}
                  >
                    <IconEye className="w-3.5 h-3.5" />
                    Rendered
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("raw")}
                    className={cn(
                      "flex items-center gap-1 px-2.5 py-1 text-xs transition-colors",
                      previewTab === "raw"
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-text hover:text-foreground"
                    )}
                  >
                    <IconFileText className="w-3.5 h-3.5" />
                    Raw MDX
                  </button>
                </div>
              </div>

              <div className="flex-1 min-h-[400px] p-4 rounded-xl border border-border bg-white dark:bg-white/5 overflow-auto">
                {previewTab === "rendered" ? (
                  markdown ? (
                    <MdxPreview content={markdown} />
                  ) : (
                    <p className="text-muted-text text-sm italic">
                      No content to preview
                    </p>
                  )
                ) : (
                  <MdxRawPreview content={finalMdx} />
                )}
              </div>
            </div>
          </div>

          {/* Image handling section (only show if images detected) */}
          {images.length > 0 && (
            <div className="flex flex-col gap-3 p-4 rounded-xl border border-border bg-black/[0.02] dark:bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <IconImage className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-foreground/80">
                  {images.length} image{images.length !== 1 ? "s" : ""} detected
                  {notionImageCount > 0
                    ? ` (${notionImageCount} from Notion CDN)`
                    : ""}
                </span>
              </div>

              {/* Image mode toggle */}
              {notionImageCount > 0 && (
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-text">Image mode:</span>
                  <div className="flex rounded-lg border border-border overflow-hidden">
                    <button
                      type="button"
                      onClick={handleUseRemote}
                      className={cn(
                        "px-3 py-1 text-xs transition-colors",
                        imageMode === "remote"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-text hover:text-foreground"
                      )}
                    >
                      Remote URLs
                    </button>
                    <button
                      type="button"
                      onClick={handleConvertToBase64}
                      className={cn(
                        "px-3 py-1 text-xs transition-colors",
                        imageMode === "base64"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-text hover:text-foreground"
                      )}
                      disabled={base64InProgress}
                    >
                      {base64InProgress ? "Converting..." : "Base64 embed"}
                    </button>
                  </div>
                  {base64Errors > 0 && (
                    <span className="flex items-center gap-1 text-xs text-destructive">
                      <IconAlertCircle className="w-3 h-3" />
                      {base64Errors} failed
                    </span>
                  )}
                </div>
              )}

              {/* Image gallery preview */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div
                    key={`${img.url}-${i}`}
                    className="relative group aspect-video rounded-lg overflow-hidden border border-border bg-black/5"
                  >
                    {img.loading ? (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      </div>
                    ) : img.error ? (
                      <div className="w-full h-full flex flex-col items-center justify-center gap-1 text-xs text-destructive">
                        <IconAlertCircle className="w-4 h-4" />
                        Failed
                      </div>
                    ) : (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img.base64 || img.url}
                        alt={img.alt || `Image ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                    {img.base64 && (
                      <div className="absolute top-1 right-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-green-500/90 text-white text-[10px] font-medium">
                        <IconCheckCircle className="w-3 h-3" />
                        Embedded
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCopy}
              disabled={!markdown}
              variant="default"
              size="default"
              className="flex items-center gap-2"
            >
              {copyStatus === "copied" ? (
                <>
                  <IconCheckCircle className="w-4 h-4" />
                  Copied!
                </>
              ) : copyStatus === "error" ? (
                <>
                  <IconAlertCircle className="w-4 h-4" />
                  Copy failed
                </>
              ) : (
                <>
                  <IconCopy className="w-4 h-4" />
                  Copy MDX
                </>
              )}
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!markdown}
              variant="outline"
              size="default"
              className="flex items-center gap-2"
            >
              <IconDownload className="w-4 h-4" />
              Download .mdx
            </Button>
            <span className="text-xs text-muted-text ml-auto">
              {title ? `${title.replace(/[^a-zA-Z0-9]+/g, "-").toLowerCase()}.mdx` : "untitled.mdx"}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
