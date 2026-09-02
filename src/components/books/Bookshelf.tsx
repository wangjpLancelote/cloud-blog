"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { cn } from "@/lib/utils";
import { useReaderStore } from "@/store/reader";
import type { Book } from "@/types/book";
import { BookOpen } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ComponentType, useMemo, useState } from "react";

const IconBookOpen = BookOpen as unknown as ComponentType<{
  className?: string;
}>;

type BookshelfProps = {
  books: Book[];
  categories: string[];
};

export function Bookshelf({ books, categories }: BookshelfProps) {
  const { t } = useI18n();
  const [activeCategory, setActiveCategory] = useState("all");
  const progress = useReaderStore((state) => state.progress);

  const visibleBooks = useMemo(
    () =>
      activeCategory === "all" ? books : books.filter((book) => book.category === activeCategory),
    [activeCategory, books]
  );

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20 w-full max-w-7xl">
      <header className="mb-10">
        <div className="flex items-center gap-2 mb-3 font-medium text-[#6e6b60] text-xs uppercase tracking-[0.24em]">
          <IconBookOpen className="w-4 h-4" />
          {t("books.eyebrow")}
        </div>
        <div className="flex md:flex-row flex-col md:justify-between md:items-end gap-5">
          <div>
            <h1 className="font-serif font-semibold text-[#282822] text-4xl sm:text-5xl tracking-tight">
              {t("books.title")}
            </h1>
            <p className="mt-3 max-w-xl text-[#6e6b60] text-base sm:text-lg">
              {t("books.description")}
            </p>
          </div>
          <div className="text-[#78756b] text-sm tabular-nums">
            {visibleBooks.length} {t("books.booksCount")}
          </div>
        </div>
      </header>

      <div
        className="flex gap-2 mb-10 pb-2 overflow-x-auto"
        role="tablist"
        aria-label={t("books.title")}
      >
        {["all", ...categories].map((category) => {
          const active = category === activeCategory;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveCategory(category)}
              className={cn(
                "px-4 py-2 rounded-full border whitespace-nowrap text-sm transition-colors",
                active
                  ? "bg-[#34352f] border-[#34352f] text-[#f7f4eb]"
                  : "bg-white/45 border-black/10 text-[#66645b] hover:bg-white/75 hover:text-[#282822]"
              )}
            >
              {category === "all" ? t("books.all") : category}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-x-5 sm:gap-x-8 gap-y-12">
        {visibleBooks.map((book) => {
          const saved = progress[book.slug];
          const percentage = Math.round((saved?.percentage ?? 0) * 100);

          return (
            <article key={book.slug} className="group min-w-0">
              <Link
                href={`/books/${book.slug}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#4e5048] focus-visible:ring-offset-4 rounded-sm"
              >
                <div className="relative mx-auto w-full max-w-52 aspect-[2/3] [perspective:1000px]">
                  <div className="absolute -bottom-3 left-[-7%] bg-[linear-gradient(180deg,#b7afa0,#8f8778)] shadow-[0_7px_11px_rgba(54,49,40,0.22)] rounded-[2px] w-[114%] h-3" />
                  <div className="relative bg-[#d8d1c1] shadow-[8px_12px_20px_rgba(48,45,38,0.2),-2px_2px_4px_rgba(0,0,0,0.12)] rounded-r-[4px] w-full h-full overflow-hidden transition-transform duration-300 ease-out origin-left group-hover:[transform:rotateY(-4deg)_translateY(-5px)]">
                    <Image
                      src={book.cover}
                      alt={`${book.title} - ${book.author}`}
                      fill
                      sizes="(max-width: 640px) 42vw, (max-width: 1024px) 28vw, 190px"
                      className="object-cover"
                    />
                    <div className="left-0 absolute inset-y-0 bg-gradient-to-r from-black/20 via-white/10 to-transparent w-3" />
                    {percentage > 0 && (
                      <div className="right-0 bottom-0 left-0 absolute bg-black/15 h-1.5">
                        <div className="bg-[#f1eee5] h-full" style={{ width: `${percentage}%` }} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <h2 className="font-serif font-semibold text-[#2f302b] group-hover:text-black text-base sm:text-lg leading-snug truncate transition-colors">
                    {book.title}
                  </h2>
                  <p className="mt-1 text-[#747168] text-sm truncate">{book.author}</p>
                  <p className="mt-2 font-medium text-[#5c5d55] text-xs">
                    {saved ? `${t("books.continue")} · ${percentage}%` : t("books.start")}
                  </p>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
}
