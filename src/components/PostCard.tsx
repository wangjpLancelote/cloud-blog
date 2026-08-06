"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Calendar, ArrowRight, MoreHorizontal, Copy, Check } from "lucide-react";
import type { ComponentType } from "react";
import type { PostItem } from "@/lib/posts";
import { cn } from "@/lib/utils";

const IconCalendar = Calendar as unknown as ComponentType<{ className?: string }>;
const IconArrowRight = ArrowRight as unknown as ComponentType<{ className?: string }>;
const IconMore = MoreHorizontal as unknown as ComponentType<{ className?: string }>;
const IconCopy = Copy as unknown as ComponentType<{ className?: string }>;
const IconCheck = Check as unknown as ComponentType<{ className?: string }>;

function formatDate(dateStr?: string): string {
  if (dateStr) return dateStr;
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function buildPostUrl(slug: string): string {
  if (typeof window === "undefined") return `/blog/${slug}`;
  return `${window.location.origin}/blog/${slug}`;
}

const categoryTones: Record<string, string> = {
  blockchain: "bg-emerald-50 text-emerald-700 border-emerald-200",
  learning: "bg-sky-50 text-sky-700 border-sky-200",
  frontend: "bg-amber-50 text-amber-700 border-amber-200",
  thoughts: "bg-purple-50 text-purple-700 border-purple-200",
  default: "bg-primary/10 text-primary border-primary/30",
};

function getCategoryTone(category: string | null): string {
  if (!category) return categoryTones.default;
  const key = category.trim().toLowerCase();
  return categoryTones[key] ?? categoryTones.default;
}

export function PostCard({ post }: { post: PostItem }) {
  const categoryLabel =
    post.category && post.category.trim().length > 0 ? post.category : null;
  const titleLabel = post.frontmatter.title;
  const categoryTone = getCategoryTone(categoryLabel);
  const displayDate = formatDate(post.frontmatter.date);
  const [copied, setCopied] = useState(false);

  const handleCopyLink = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      navigator.clipboard.writeText(buildPostUrl(post.slug));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
    [post.slug]
  );

  return (
    <div className="group/card relative h-full">
      {/* Main card link */}
      <Link href={`/blog/${post.slug}`} className="block h-full">
        <article className="flex flex-col h-full min-h-[220px] p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-white/30 shadow-subtle hover:shadow-card hover:border-primary/20 transition-all duration-300">
          {/* Top: category badge + date */}
          <div className="flex items-center justify-between mb-3">
            {categoryLabel ? (
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${categoryTone}`}
              >
                {categoryLabel}
              </span>
            ) : (
              <span />
            )}
            <span className="flex items-center gap-1 text-muted-text text-xs shrink-0">
              <IconCalendar className="w-3 h-3" />
              {displayDate}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-foreground group-hover/card:text-primary text-base leading-snug mb-2 line-clamp-2 transition-colors">
            {titleLabel}
          </h3>

          {/* Summary */}
          {post.summary && (
            <p className="text-muted-text text-sm leading-relaxed line-clamp-3">
              {post.summary}
            </p>
          )}

          {/* Spacer to push bottom bar down */}
          <div className="flex-1" />

          {/* Bottom: word count + read more */}
          <div className="flex items-center justify-between mt-4 pt-3 border-t border-border/50">
            <span className="text-muted-text text-xs">
              {post.wordCount >= 10000
                ? `${(post.wordCount / 10000).toFixed(1)}万字`
                : `${post.wordCount}字`}
            </span>
            <span className="inline-flex items-center gap-1 text-primary/80 group-hover/card:text-primary text-xs font-medium transition-colors">
              阅读全文
              <IconArrowRight className="w-3 h-3 group-hover/card:translate-x-0.5 transition-transform" />
            </span>
          </div>
        </article>
      </Link>

      {/* Dropdown trigger — shown on card hover */}
      <div className="absolute top-3 right-3 z-10">
        <div className="opacity-0 group-hover/card:opacity-100 transition-opacity">
          <div className="relative group/dropdown">
            <button
              type="button"
              className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/90 shadow-sm border border-black/5 text-muted-text hover:text-foreground hover:bg-white transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              aria-label="文章操作"
            >
              <IconMore className="w-3.5 h-3.5" />
            </button>

            {/* Dropdown menu */}
            <div className="absolute right-0 top-full mt-1 w-40 py-1 bg-white rounded-lg shadow-card border border-border/50 opacity-0 invisible group-hover/dropdown:opacity-100 group-hover/dropdown:visible transition-all duration-150">
              <button
                type="button"
                onClick={handleCopyLink}
                className={cn(
                  "flex items-center gap-2 w-full px-3 py-2 text-sm text-left transition-colors",
                  copied
                    ? "text-green-600"
                    : "text-foreground/80 hover:bg-black/5"
                )}
              >
                {copied ? (
                  <>
                    <IconCheck className="w-3.5 h-3.5 shrink-0" />
                    已复制
                  </>
                ) : (
                  <>
                    <IconCopy className="w-3.5 h-3.5 shrink-0" />
                    复制文章链接
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
