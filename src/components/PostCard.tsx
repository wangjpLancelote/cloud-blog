"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { Calendar, ArrowRight, Link2, Check } from "lucide-react";
import type { ComponentType } from "react";
import type { PostItem } from "@/lib/posts";
import { cn } from "@/lib/utils";

const IconCalendar = Calendar as unknown as ComponentType<{ className?: string }>;
const IconArrowRight = ArrowRight as unknown as ComponentType<{ className?: string }>;
const IconLink = Link2 as unknown as ComponentType<{ className?: string }>;
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

      {/* Copy link bar — fades in below the card on hover */}
      <button
        type="button"
        onClick={handleCopyLink}
        className={cn(
          "absolute left-0 right-0 top-full",
          "flex items-center justify-center gap-1.5 h-6",
          "bg-gradient-to-b from-white/50 to-transparent",
          "rounded-b-lg",
          "text-xs",
          "opacity-0 group-hover/card:opacity-100",
          "transition-opacity duration-300",
          copied ? "text-green-600" : "text-muted-text hover:text-primary"
        )}
      >
        {copied ? (
          <>
            <IconCheck className="w-3 h-3" />
            已复制
          </>
        ) : (
          <>
            <IconLink className="w-3 h-3" />
            复制链接
          </>
        )}
      </button>
    </div>
  );
}
