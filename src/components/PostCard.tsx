"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/cloud-ui/card";
import { ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostItem } from "@/lib/posts";
import type { ComponentType } from "react";

// 修复 React 19 下 Lucide 图标的类型兼容性问题
const IconChevronDown = ChevronDown as unknown as ComponentType<{
  className?: string;
}>;
const IconChevronUp = ChevronUp as unknown as ComponentType<{
  className?: string;
}>;
const IconBookOpen = BookOpen as unknown as ComponentType<{
  className?: string;
}>;

export function PostCard({ post }: { post: PostItem }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="group bg-white/80 shadow-subtle hover:shadow-card backdrop-blur-md mx-auto border-white/20 w-full max-w-3xl md:max-w-4xl lg:max-w-5xl overflow-hidden transition-all duration-300">
      <CardHeader
        className="px-5 py-8 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-center">
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
          <button className="p-1 text-muted-text hover:text-foreground transition-colors shrink-0">
            {isExpanded ? (
              <IconChevronUp className="w-4 h-4" />
            ) : (
              <IconChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </CardHeader>

      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isExpanded ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="px-5 pb-4">
          <CardContent className="p-0 text-muted-text text-sm leading-relaxed">
            {post.summary}
          </CardContent>
          <div className="flex justify-end mt-4 pt-4 border-black/5 border-t">
            <Link
              href={`/blog/${post.slug}`}
              className="flex items-center gap-2 font-medium text-primary text-sm hover:underline"
            >
              <IconBookOpen className="w-4 h-4" />
              阅读全文
            </Link>
          </div>
        </div>
      </div>
    </Card>
  );
}
