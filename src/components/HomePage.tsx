"use client";

import Image from "next/image";
import { useI18n } from "@/app/(translate)/I18nProvider";
import { FilterablePosts } from "@/components/FilterablePosts";
import type { PostItem } from "@/lib/posts";

export function HomePage({ posts }: { posts: PostItem[] }) {
  const { t } = useI18n();
  return (
    <div className="home-page">
      <section className="home-intro reading-width">
        <span className="eyebrow">LORENZO WANG / A PERSONAL JOURNAL</span>
        <h1>{t("site.intro")}</h1>
        <p>{t("site.description")}</p>
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
          <span>{t("layout.title")}</span>
          <span aria-hidden="true">A MOMENT OF STILLNESS</span>
        </figcaption>
      </figure>
      <div className="reading-width">
        <section className="home-section" aria-labelledby="recent-heading">
          <div className="section-heading">
            <h2 id="recent-heading">{t("site.recent")}</h2>
          </div>
          <FilterablePosts posts={posts} />
          <p className="collection-note">
            {posts.length} {t("site.collection")}
          </p>
        </section>
      </div>
    </div>
  );
}
