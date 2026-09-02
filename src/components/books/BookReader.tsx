"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import {
  EpubReaderAdapter,
  type EpubReaderHandle,
  type ReadingMode,
  type ReaderTocItem,
} from "@/components/books/EpubReaderAdapter";
import { ReaderSettings } from "@/components/books/ReaderSettings";
import { ReaderTocDrawer } from "@/components/books/ReaderTocDrawer";
import { cn } from "@/lib/utils";
import { useReaderStore } from "@/store/reader";
import type { Book } from "@/types/book";
import { ArrowLeft, ChevronLeft, ChevronRight, List } from "lucide-react";
import Link from "next/link";
import { type ComponentType, useCallback, useEffect, useRef, useState } from "react";

const IconArrowLeft = ArrowLeft as unknown as ComponentType<{ className?: string }>;
const IconChevronLeft = ChevronLeft as unknown as ComponentType<{ className?: string }>;
const IconChevronRight = ChevronRight as unknown as ComponentType<{ className?: string }>;
const IconList = List as unknown as ComponentType<{ className?: string }>;

const READER_COLORS = {
  paper: { background: "#f4f1e8", foreground: "#292821", border: "#d5cebe" },
  sepia: { background: "#e8dcc2", foreground: "#3c3326", border: "#c9b995" },
  dark: { background: "#20211e", foreground: "#dedbd1", border: "#3a3b36" },
} as const;

function findChapter(items: ReaderTocItem[], href?: string): string | undefined {
  if (!href) return undefined;
  const cleanHref = href.split("#")[0];
  for (const item of items) {
    if (item.href.split("#")[0] === cleanHref) return item.label.trim();
    const nested = item.subitems ? findChapter(item.subitems, href) : undefined;
    if (nested) return nested;
  }
  return undefined;
}

export function BookReader({ book }: { book: Book }) {
  const { t } = useI18n();
  const readerRef = useRef<EpubReaderHandle>(null);
  const locationRef = useRef<string | null>(null);
  const tocRef = useRef<ReaderTocItem[]>([]);
  const restoredRef = useRef(false);
  const [location, setLocation] = useState<string | null>(null);
  const [toc, setToc] = useState<ReaderTocItem[]>([]);
  const [tocOpen, setTocOpen] = useState(false);
  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  const savedProgress = useReaderStore((state) => state.progress[book.slug]);
  const setProgress = useReaderStore((state) => state.setProgress);
  const theme = useReaderStore((state) => state.theme);
  const fontScale = useReaderStore((state) => state.fontScale);
  const lineHeight = useReaderStore((state) => state.lineHeight);
  const fontFamily = useReaderStore((state) => state.fontFamily);
  const preferences = { theme, fontScale, lineHeight, fontFamily };
  const colors = READER_COLORS[preferences.theme];
  const readingMode: ReadingMode = isMobile ? "paginated" : "scrolled";

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const updateReadingMode = () => setIsMobile(mediaQuery.matches);
    updateReadingMode();
    mediaQuery.addEventListener("change", updateReadingMode);
    return () => mediaQuery.removeEventListener("change", updateReadingMode);
  }, []);

  useEffect(() => {
    if (restoredRef.current || !savedProgress?.cfi) return;
    restoredRef.current = true;
    locationRef.current = savedProgress.cfi;
    setLocation(savedProgress.cfi);
  }, [savedProgress]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest("button, input, [role='dialog']")) return;
      if (isMobile && (event.key === "PageDown" || event.key === " ")) {
        event.preventDefault();
        readerRef.current?.next();
      }
      if (isMobile && event.key === "PageUp") {
        event.preventDefault();
        readerRef.current?.previous();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMobile]);

  const handleProgress = useCallback(
    (percentage: number, href?: string) => {
      const cfi = locationRef.current;
      if (!cfi) return;
      setProgress(book.slug, {
        cfi,
        percentage,
        chapter: findChapter(tocRef.current, href),
        updatedAt: Date.now(),
      });
    },
    [book.slug, setProgress]
  );

  const selectLocation = (nextLocation: string) => {
    locationRef.current = nextLocation;
    setLocation(nextLocation);
  };

  const percentage = Math.round((savedProgress?.percentage ?? 0) * 100);

  return (
    <div
      className="flex flex-col w-full h-[calc(100dvh-4rem)] overflow-hidden transition-colors"
      style={{ background: colors.background, color: colors.foreground }}
    >
      <header
        className="z-20 flex items-center gap-2 px-3 sm:px-5 border-b h-14 shrink-0"
        style={{ borderColor: colors.border }}
      >
        <Link
          href="/books"
          className="flex justify-center items-center hover:bg-black/7 rounded-full w-9 h-9 transition-colors"
          aria-label={t("books.back")}
          title={t("books.back")}
        >
          <IconArrowLeft className="w-[18px] h-[18px]" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-serif font-semibold text-sm sm:text-base truncate">{book.title}</h1>
          <p className="hidden sm:block opacity-60 text-[11px] truncate">{book.author}</p>
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <button
            type="button"
            onClick={() => setTocOpen(true)}
            className="flex justify-center items-center hover:bg-black/7 rounded-full w-9 h-9 transition-colors"
            aria-label={t("books.contents")}
            title={t("books.contents")}
          >
            <IconList className="w-[18px] h-[18px]" />
          </button>
          <ReaderSettings />
        </div>
      </header>

      <div className="relative flex-1 min-h-0">
        {isMobile === null ? (
          <div className="absolute inset-0 flex justify-center items-center opacity-60 text-sm tracking-wide">
            {t("books.loading")}
          </div>
        ) : (
          <EpubReaderAdapter
            ref={readerRef}
            url={book.epub}
            location={location}
            preferences={preferences}
            readingMode={readingMode}
            onLocationChange={selectLocation}
            onProgressChange={handleProgress}
            onTocChange={(nextToc) => {
              tocRef.current = nextToc;
              setToc(nextToc);
            }}
            loadingLabel={t("books.loading")}
            errorLabel={t("books.error")}
          />
        )}

        {isMobile && (
          <>
            <button
              type="button"
              onClick={() => readerRef.current?.previous()}
              className={cn(
                "top-0 bottom-0 left-0 z-10 absolute flex items-center px-1 opacity-0 focus-visible:opacity-100 transition-opacity",
                "bg-gradient-to-r from-black/5 to-transparent"
              )}
              aria-label={t("books.previous")}
            >
              <IconChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={() => readerRef.current?.next()}
              className={cn(
                "top-0 right-0 bottom-0 z-10 absolute flex items-center px-1 opacity-0 focus-visible:opacity-100 transition-opacity",
                "bg-gradient-to-l from-black/5 to-transparent"
              )}
              aria-label={t("books.next")}
            >
              <IconChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      <footer
        className="flex items-center gap-4 px-5 border-t h-10 text-[11px] shrink-0"
        style={{ borderColor: colors.border }}
      >
        <span className="opacity-60 truncate">{savedProgress?.chapter || book.title}</span>
        <div className="relative bg-black/10 ml-auto rounded-full w-24 sm:w-36 h-1 overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-current opacity-60 rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <span className="opacity-70 min-w-8 tabular-nums text-right">{percentage}%</span>
      </footer>

      <ReaderTocDrawer
        open={tocOpen}
        onOpenChange={setTocOpen}
        toc={toc}
        onSelect={selectLocation}
      />
    </div>
  );
}
