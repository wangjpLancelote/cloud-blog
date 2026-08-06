"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/PostCard";
import type { PostItem } from "@/lib/posts";
import { cn } from "@/lib/utils";

type Category = { name: string; count: number };
type LayoutCols = 1 | 2 | 3;

type Props = {
  posts: PostItem[];
  categories: Category[];
};

const GRID_CLASS: Record<LayoutCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};

/** Miniature layout icon: draws a grid of small rectangles */
function LayoutIcon({ cols }: { cols: LayoutCols }) {
  const rows = 2;
  const gap = 2;
  const w = cols === 1 ? 20 : cols === 2 ? 10 : 6.5;
  const h = 7;
  const totalW = cols * w + (cols - 1) * gap;
  const totalH = rows * h + (rows - 1) * gap;

  const rects: React.ReactNode[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rects.push(
        <rect
          key={`r${r}c${c}`}
          x={c * (w + gap)}
          y={r * (h + gap)}
          width={w}
          height={h}
          rx={1.5}
          fill="currentColor"
          opacity="0.85"
        />
      );
    }
  }

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      className="block"
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}

export function BlogList({ posts, categories }: Props) {
  const [active, setActive] = useState("All");
  const [layout, setLayout] = useState<LayoutCols>(3);

  const filtered = useMemo(() => {
    if (active === "All") return posts;
    return posts.filter((p) => p.category === active);
  }, [active, posts]);

  return (
    <div className="space-y-6">
      {/* Top bar: categories on left, layout toggle on right */}
      <div className="flex items-end justify-between gap-4">
        {/* Categories */}
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

        {/* Layout toggle buttons */}
        <div className="hidden sm:flex items-center gap-1 shrink-0 pb-1">
          {([1, 2, 3] as LayoutCols[]).map((cols) => (
            <button
              key={cols}
              type="button"
              onClick={() => setLayout(cols)}
              title={`${cols}列布局`}
              className={cn(
                "flex items-center justify-center w-8 h-8 p-1 rounded-md border transition-colors",
                layout === cols
                  ? "bg-black/10 border-black/15 text-foreground"
                  : "border-transparent text-muted-text hover:text-foreground hover:bg-black/5 hover:border-black/8"
              )}
            >
              <LayoutIcon cols={cols} />
            </button>
          ))}
        </div>
      </div>

      {/* Post grid */}
      <div className={cn("grid gap-5", GRID_CLASS[layout])}>
        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
