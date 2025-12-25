import type { ReactNode } from "react";
import { BlogTitle } from "@/components/BlogTitle";
import BlogHeader from "@/components/Header";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col mx-auto px-4 lg:px-6 pt-6 pb-12 max-w-5xl min-h-screen">
      <header className="relative bg-white shadow-card hover:shadow-glass border border-white/20 rounded-2xl h-[200px] overflow-hidden transition-shadow duration-300">
        {/* 背景玻璃层 */}
        <div className="absolute inset-0 bg-mac-glass backdrop-blur-xl backdrop-saturate-150" />
        {/* 文本层 */}
        <div className="z-10 relative flex items-center px-6 h-full text-foreground">
          <BlogHeader>
            <BlogTitle />
          </BlogHeader>
        </div>
      </header>

      <main className="flex-1 mt-8">
        <div className="bg-white backdrop-blur border rounded-2xl">
          {children}
        </div>
      </main>
    </div>
  );
}
