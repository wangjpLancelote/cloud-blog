"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { PostCard } from "@/components/PostCard";
import type { PostItem } from "@/lib/posts";

export function TopicPage({
  topic,
  posts,
}: { topic: "blockchain" | "learning"; posts: PostItem[] }) {
  const { t } = useI18n();
  return (
    <section>
      <header className="page-heading">
        <span className="eyebrow">{topic === "blockchain" ? "ON CHAIN" : "ALWAYS LEARNING"}</span>
        <h1>{t(`menu.${topic}`)}</h1>
        <p>{t(`site.${topic}Description`)}</p>
      </header>
      <div className="post-list">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
      {!posts.length && <p className="empty-state">{t("site.empty")}</p>}
    </section>
  );
}
