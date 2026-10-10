"use client";

import Image from "next/image";
import { useI18n } from "@/app/(translate)/I18nProvider";
import { BlogTitle } from "@/components/BlogTitle";
import { FilterablePosts } from "@/components/FilterablePosts";
import type { PostItem } from "@/lib/posts";

export function HomePage({ posts }: { posts: PostItem[] }) {
  const { t } = useI18n();
  return (
    <div className="home-page">
      <div className="reading-width home-lead">
        <section className="home-intro">
          <BlogTitle />
        </section>
        <figure className="home-landscape">
          <Image
            src="/images/quiet-landscape.svg"
            alt={t("site.landscapeAlt")}
            width={1200}
            height={440}
            priority
          />
          <figcaption>
            <span aria-hidden="true">A MOMENT OF STILLNESS</span>
          </figcaption>
        </figure>
      </div>
      <div className="reading-width">
        <section className="home-section" aria-labelledby="recent-heading">
          <FilterablePosts posts={posts} />
          <p className="collection-note">
            {posts.length} {t("site.collection")}
          </p>
        </section>
      </div>
    </div>
  );
}
