import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/cloud-ui/card";
import { BookOpen } from "lucide-react";
import type { ComponentType } from "react";
import type { PostItem } from "@/lib/posts";

const IconBookOpen = BookOpen as unknown as ComponentType<{
  className?: string;
}>;

export function PostCard({ post }: { post: PostItem }) {
  const categoryLabel =
    post.category && post.category.trim().length > 0 ? post.category : null;
  const titleLabel = post.frontmatter.title;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block mx-auto w-full max-w-3xl md:max-w-4xl lg:max-w-5xl"
    >
      <Card className="bg-white/90 shadow-subtle hover:shadow-card border-white/20 overflow-hidden transition-shadow duration-200 cursor-pointer">
        <CardHeader className="relative px-5 py-6">
          {categoryLabel && (
            <span className="inline-flex top-4 right-4 absolute items-center gap-1 bg-primary/10 px-2 py-0.5 border border-primary/30 rounded-full max-w-[60%] font-medium text-[11px] text-primary truncate">
              {categoryLabel}
            </span>
          )}
          <div className="flex flex-col gap-1 overflow-hidden">
            <div className="flex items-center gap-3 overflow-hidden">
              <h3 className="font-semibold group-hover:text-primary text-lg truncate transition-colors">
                {titleLabel}
              </h3>
              {post.frontmatter.date && (
                <span className="text-muted-text text-xs whitespace-nowrap shrink-0">
                  {post.frontmatter.date}
                </span>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="px-5 pb-5 text-muted-text text-sm leading-relaxed">
          {post.summary}
          <div className="flex items-center gap-2 mt-3 font-medium text-primary text-sm group-hover:underline">
            <IconBookOpen className="w-4 h-4" />
            阅读全文
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
