"use client";

import { useMemo, useState } from "react";
import { useI18n } from "@/app/(translate)/I18nProvider";
import { PostCard } from "@/components/PostCard";
import { filterTags, tagTone } from "@/lib/post-display";
import type { PostItem } from "@/lib/posts";

export function FilterablePosts({ posts }: { posts: PostItem[] }) {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(null);
  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) {
      for (const tag of filterTags(post)) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    return [...counts].sort(([a], [b]) => a.localeCompare(b));
  }, [posts]);
  const matches =
    active === null ? posts : posts.filter((post) => filterTags(post).includes(active));
  return (
    <>
      <fieldset className="tag-filter-bar" aria-label={t("site.filterTags")}>
        <button
          type="button"
          className="post-tag tag-filter"
          aria-pressed={active === null}
          onClick={() => setActive(null)}
        >
          {t("site.all")} <span>{posts.length}</span>
        </button>
        {tags.map(([tag, count]) => (
          <button
            type="button"
            key={tag}
            className="post-tag tag-filter"
            data-tone={tagTone(tag)}
            aria-pressed={active === tag}
            onClick={() => setActive(tag)}
          >
            {tag === "Notes" ? t("site.notes") : tag} <span>{count}</span>
          </button>
        ))}
      </fieldset>
      <output className="filter-result">
        {matches.length} {t("site.posts")}
      </output>
      <div className="post-list">
        {matches.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {!matches.length && <p className="empty-state">{t("site.empty")}</p>}
    </>
  );
}
