import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/cloud-ui/card";
import { BookOpen } from "lucide-react";
import type { ComponentType } from "react";
import type { PostItem } from "@/lib/posts";

const IconBookOpen = BookOpen as unknown as ComponentType<{
  className?: string;
}>;

export function PostCard({ post }: { post: PostItem }) {
  const displayTitle = post.category
    ? `[${post.category}/${post.frontmatter.title}]`
    : post.frontmatter.title;

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block mx-auto w-full max-w-3xl md:max-w-4xl lg:max-w-5xl"
    >
      <Card className="bg-white/90 shadow-subtle hover:shadow-card border-white/20 overflow-hidden transition-shadow duration-200 cursor-pointer">
        <CardHeader className="px-5 py-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <CardTitle className="group-hover:text-primary text-lg truncate transition-colors">
              {displayTitle}
            </CardTitle>
            {post.frontmatter.date && (
              <span className="text-muted-text text-xs whitespace-nowrap shrink-0">
                {post.frontmatter.date}
              </span>
            )}
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
