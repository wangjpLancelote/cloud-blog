"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/PostCard";
import type { PostItem } from "@/lib/posts";
import { cn } from "@/lib/utils";

type Category = { name: string; count: number };

type Props = {
  posts: PostItem[];
  categories: Category[];
};

export function BlogList({ posts, categories }: Props) {
  const [active, setActive] = useState("All");

  const filtered = useMemo(() => {
    if (active === "All") return posts;
    return posts.filter((p) => p.category === active);
  }, [active, posts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-3 pb-2 text-sm" role="tablist">
        {categories.map((cat) => {
          const isActive = cat.name === active;
          return (
            <div
              key={cat.name}
              className={cn(
                "inline-flex items-center gap-2 px-1 py-1 transition-colors cursor-pointer",
                "text-muted-text hover:text-foreground hover:shadow-[0_2px_0_rgba(0,0,0,0.08)]",
                isActive &&
                  "text-primary font-medium pb-0 shadow-[0_2px_0_rgba(0,0,0,0.2)]"
              )}
              role="tab"
              aria-selected={isActive}
              tabIndex={0}
              onClick={() => setActive(cat.name)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setActive(cat.name);
                }
              }}
            >
              <span>{cat.name}</span>
              <span className="text-muted-text text-xs">({cat.count})</span>
            </div>
          );
        })}
      </div>

      <div className="gap-6 grid">
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
