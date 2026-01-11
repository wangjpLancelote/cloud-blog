import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/cloud-ui/card";
import { BookOpen, Calendar, FileText } from "lucide-react";
import type { ComponentType } from "react";
import type { PostItem } from "@/lib/posts";

const IconBookOpen = BookOpen as unknown as ComponentType<{
  className?: string;
}>;
const IconCalendar = Calendar as unknown as ComponentType<{
  className?: string;
}>;
const IconFileText = FileText as unknown as ComponentType<{
  className?: string;
}>;

// 格式化日期：如果没有日期则使用当天
function formatDate(dateStr?: string): string {
  if (dateStr) return dateStr;
  const today = new Date();
  return today.toISOString().split("T")[0]; // YYYY-MM-DD
}

// 格式化字数
function formatWordCount(count: number): string {
  if (count >= 10000) {
    return `${(count / 10000).toFixed(1)}万字`;
  }
  return `${count}字`;
}

const categoryTones: Record<string, string> = {
  blockchain: "bg-emerald-50 text-emerald-700 border-emerald-200",
  learning: "bg-sky-50 text-sky-700 border-sky-200",
  frontend: "bg-amber-50 text-amber-700 border-amber-200",
  thoughts: "bg-purple-50 text-purple-700 border-purple-200",
  default: "bg-primary/10 text-primary border-primary/30",
};

function getCategoryTone(category: string | null): string {
  if (!category) return categoryTones.default;
  const key = category.trim().toLowerCase();
  return categoryTones[key] ?? categoryTones.default;
}

export function PostCard({ post }: { post: PostItem }) {
  const categoryLabel =
    post.category && post.category.trim().length > 0 ? post.category : null;
  const titleLabel = post.frontmatter.title;
  const categoryTone = getCategoryTone(categoryLabel);
  const displayDate = formatDate(post.frontmatter.date);
  const displayWordCount = formatWordCount(post.wordCount);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group block mx-auto w-full max-w-3xl md:max-w-4xl lg:max-w-5xl"
    >
      <Card className="bg-white/90 shadow-subtle hover:shadow-card border-white/20 overflow-hidden transition-shadow duration-200 cursor-pointer">
        <CardHeader className="relative px-4 py-4 md:px-5 md:py-6">
          {categoryLabel && (
            <span
              className={`inline-flex top-4 right-4 md:top-4 md:right-4 absolute items-center gap-1 px-2 py-0.5 border rounded-full max-w-[40%] md:max-w-[60%] font-medium text-[10px] md:text-[11px] truncate ${categoryTone}`}
            >
              {categoryLabel}
            </span>
          )}
          <div className="flex flex-col gap-2 md:gap-1 overflow-hidden pr-16 md:pr-0">
            <div className="flex flex-col md:flex-row md:items-center gap-0.5 md:gap-3 overflow-hidden">
              <h3 className="font-semibold group-hover:text-primary text-base md:text-lg truncate transition-colors">
                {titleLabel}
              </h3>
              {/* 桌面端：日期和字数 */}
              <div className="hidden md:flex items-center gap-3 text-muted-text text-xs whitespace-nowrap shrink-0">
                <span className="flex items-center gap-1">
                  <IconCalendar className="w-3.5 h-3.5" />
                  {displayDate}
                </span>
                <span className="flex items-center gap-1">
                  <IconFileText className="w-3.5 h-3.5" />
                  {displayWordCount}
                </span>
              </div>
            </div>
            {/* 移动端：日期、字数和摘要 */}
            <div className="md:hidden flex flex-col gap-1.5">
              <div className="flex items-center gap-3 text-muted-text text-[11px]">
                <span className="flex items-center gap-1">
                  <IconCalendar className="w-3 h-3" />
                  {displayDate}
                </span>
                <span className="flex items-center gap-1">
                  <IconFileText className="w-3 h-3" />
                  {displayWordCount}
                </span>
              </div>
              {post.summary && (
                <p className="text-muted-text text-xs line-clamp-1">
                  {post.summary}
                </p>
              )}
            </div>
          </div>
        </CardHeader>

        {/* 桌面端：完整摘要和阅读全文 */}
        <CardContent className="hidden md:block px-5 pb-5 text-muted-text text-sm leading-relaxed">
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
