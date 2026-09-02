import type { Book } from "@/types/book";

/**
 * Static book catalogue. EPUB files stay in public/books so the catalogue also
 * works with Next.js static export.
 */
export const BOOKS: Book[] = [
  {
    slug: "cloud-reader-guide",
    title: "Cloud Reader 使用指南",
    author: "Cloud Blog",
    category: "随笔",
    description: "一本用于体验书架、分页阅读和阅读进度保存的迷你示例书。",
    cover: "/books/covers/cloud-reader-guide.svg",
    epub: "/books/epubs/cloud-reader-guide.epub",
    language: "zh",
  },
];
