"use client";

import { FilterablePosts } from "@/components/FilterablePosts";
import type { PostItem } from "@/lib/posts";
import { useI18n } from "@/app/(translate)/I18nProvider";

type Props = { posts: PostItem[] };
export function BlogList({ posts }: Props) {
  const { t } = useI18n();
  return (
    <section>
      <header className="page-heading">
        <span className="eyebrow">THE ARCHIVE</span>
        <h1>{t("site.archive")}</h1>
        <p>{t("site.archiveDescription")}</p>
      </header>
      <FilterablePosts posts={posts} />
    </section>
  );
}
