"use client";

import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/cloud-ui/card";
import { BookOpen } from "lucide-react";
import type { PostItem } from "@/lib/posts";
import type { ComponentType } from "react";

// 修复 React 19 下 Lucide 图标的类型兼容性问题
const IconBookOpen = BookOpen as unknown as ComponentType<{
  className?: string;
}>;

export function PostCard({ post }: { post: PostItem }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block mx-auto w-full max-w-3xl md:max-w-4xl lg:max-w-5xl"
    >
      <Card className="bg-white/80 shadow-subtle hover:shadow-card backdrop-blur-md border-white/20 overflow-hidden transition-all duration-300 cursor-pointer">
        <CardHeader className="px-5 py-6">
          <div className="flex items-center gap-3 overflow-hidden">
            <CardTitle className="group-hover:text-primary text-lg truncate transition-colors">
              {post.frontmatter.title}
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
