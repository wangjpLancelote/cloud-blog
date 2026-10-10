"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/app/(translate)/I18nProvider";
import { PostCard } from "@/components/PostCard";
import { filterTags, sortPosts, tagTone } from "@/lib/post-display";
import type { PostItem } from "@/lib/posts";

export function FilterablePosts({ posts }: { posts: PostItem[] }) {
  const { t } = useI18n();
  const [active, setActive] = useState<string | null>(null);
  const recentPosts = useMemo(() => sortPosts(posts).slice(0, 3), [posts]);
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
    <div className="posts-layout">
      <aside className="posts-sidebar" aria-labelledby="tags-heading">
        <div className="section-heading">
          <h2 id="tags-heading">{t("site.filterTags")}</h2>
        </div>
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
        <section className="sidebar-recent" aria-labelledby="recent-heading">
          <div className="section-heading">
            <h2 id="recent-heading">{t("site.recent")}</h2>
          </div>
          <ul className="sidebar-recent-list">
            {recentPosts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${encodeURIComponent(post.slug)}`}
                  title={post.frontmatter.title}
                >
                  {post.frontmatter.title}
                </Link>
              </li>
            ))}
          </ul>
          {!recentPosts.length && <p className="filter-result">{t("site.empty")}</p>}
        </section>
      </aside>
      <div className="posts-content">
        <div className="post-list">
          {matches.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
        {!matches.length && <p className="empty-state">{t("site.empty")}</p>}
      </div>
    </div>
  );
}
