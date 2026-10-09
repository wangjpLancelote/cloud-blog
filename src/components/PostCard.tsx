"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { PostItem } from "@/lib/posts";
import { filterTags, postDate, tagTone } from "@/lib/post-display";

export function PostCard({ post }: { post: PostItem }) {
  const { t } = useI18n();
  const tags = filterTags(post);
  const date = postDate(post);
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        new URL(`/blog/${encodeURIComponent(post.slug)}`, window.location.origin).href
      );
      setCopied(true);
      if (resetTimer.current) clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <article className="post-row">
      <Link href={`/blog/${encodeURIComponent(post.slug)}`} className="post-row-link">
        <div className="post-row-heading">
          <h3>{post.frontmatter.title}</h3>
          <span className="post-tags">
            {tags.map((tag) => (
              <span className="post-tag" data-tone={tagTone(tag)} key={tag}>
                {tag === "Notes" ? t("site.notes") : tag}
              </span>
            ))}
          </span>
        </div>
        {post.summary && <p className="post-summary">{post.summary}</p>}
        {date && (
          <time className="post-date" dateTime={date}>
            {date.replaceAll("-", ".")}
          </time>
        )}
      </Link>
      <button
        type="button"
        onClick={copyLink}
        className="post-copy"
        aria-label={t("site.copyLink")}
        title={t("site.copyLink")}
      >
        <span aria-live="polite">{copied ? t("site.copied") : "⧉"}</span>
      </button>
    </article>
  );
}
