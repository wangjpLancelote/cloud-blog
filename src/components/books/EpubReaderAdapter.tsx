"use client";

import type { ReaderPreferences } from "@/types/book";
import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from "react";
import { EpubView } from "react-reader";

export type ReaderTocItem = {
  label: string;
  href: string;
  subitems?: ReaderTocItem[];
};

export type EpubReaderHandle = {
  next: () => void;
  previous: () => void;
};

export type ReadingMode = "paginated" | "scrolled";

type ReaderLocations = {
  generate: (chars?: number) => Promise<unknown>;
  percentageFromCfi: (cfi: string) => number;
};

type ReaderRendition = {
  prev: () => Promise<unknown>;
  next: () => Promise<unknown>;
  display: (target?: string) => Promise<unknown>;
  on: (event: string, callback: (location: ReaderLocation) => void) => void;
  themes: {
    default: (rules: Record<string, Record<string, string>>) => void;
    fontSize: (size: string) => void;
    font: (family: string) => void;
  };
  book: {
    locations: ReaderLocations;
  };
  hooks: {
    content: {
      register: (callback: (contents: ReaderContents) => void) => void;
    };
  };
};

type ReaderContents = {
  document: Document;
};

type ReaderLocation = {
  start?: {
    cfi?: string;
    href?: string;
    percentage?: number;
  };
};

type EpubReaderAdapterProps = {
  url: string;
  location: string | null;
  preferences: ReaderPreferences;
  readingMode: ReadingMode;
  onLocationChange: (cfi: string) => void;
  onProgressChange: (percentage: number, href?: string) => void;
  onTocChange: (toc: ReaderTocItem[]) => void;
  loadingLabel: string;
  errorLabel: string;
};

const PALETTES = {
  paper: { background: "#f4f1e8", foreground: "#292821" },
  sepia: { background: "#e8dcc2", foreground: "#3c3326" },
  dark: { background: "#20211e", foreground: "#dedbd1" },
} as const;

export const EpubReaderAdapter = forwardRef<EpubReaderHandle, EpubReaderAdapterProps>(
  function EpubReaderAdapter(
    {
      url,
      location,
      preferences,
      readingMode,
      onLocationChange,
      onProgressChange,
      onTocChange,
      loadingLabel,
      errorLabel,
    },
    ref
  ) {
    const renditionRef = useRef<ReaderRendition | null>(null);
    const locationsReadyRef = useRef(false);

    const applyPreferences = useCallback(
      (rendition: ReaderRendition) => {
        const palette = PALETTES[preferences.theme];
        const isScrolled = readingMode === "scrolled";
        rendition.themes.default({
          html: { background: palette.background },
          body: {
            background: palette.background,
            color: palette.foreground,
            "line-height": String(preferences.lineHeight),
            "box-sizing": "border-box",
            "margin-left": "auto",
            "margin-right": "auto",
            "max-width": isScrolled ? "760px" : "none",
            "padding-top": isScrolled ? "48px" : "0",
            "padding-right": isScrolled ? "32px" : "0",
            "padding-bottom": isScrolled ? "72px" : "0",
            "padding-left": isScrolled ? "32px" : "0",
            "overscroll-behavior-x": "contain",
          },
          "p, li": { color: palette.foreground },
          "a, a:visited": { color: palette.foreground },
        });
        rendition.themes.fontSize(`${preferences.fontScale}%`);
        rendition.themes.font(
          preferences.fontFamily === "serif"
            ? "Georgia, 'Noto Serif SC', serif"
            : "Arial, 'Noto Sans SC', sans-serif"
        );
      },
      [preferences, readingMode]
    );

    useEffect(() => {
      if (renditionRef.current) applyPreferences(renditionRef.current);
    }, [applyPreferences]);

    useImperativeHandle(
      ref,
      () => ({
        next: () => {
          void renditionRef.current?.next();
        },
        previous: () => {
          void renditionRef.current?.prev();
        },
      }),
      []
    );

    const reportFromCfi = useCallback(
      (cfi: string, href?: string) => {
        const locations = renditionRef.current?.book.locations;
        if (!locations || !locationsReadyRef.current) return;
        const percentage = locations.percentageFromCfi(cfi);
        if (Number.isFinite(percentage)) {
          onProgressChange(Math.min(1, Math.max(0, percentage)), href);
        }
      },
      [onProgressChange]
    );

    return (
      <EpubView
        key={readingMode}
        url={url}
        location={location}
        locationChanged={(cfi) => {
          onLocationChange(cfi);
          reportFromCfi(cfi);
        }}
        tocChanged={(items) => onTocChange(items as ReaderTocItem[])}
        getRendition={(rendition) => {
          const reader = rendition as unknown as ReaderRendition;
          renditionRef.current = reader;
          applyPreferences(reader);

          if (readingMode === "paginated") {
            reader.hooks.content.register(({ document }) => {
              let startX = 0;
              let startY = 0;

              document.addEventListener(
                "touchstart",
                (event) => {
                  const touch = event.changedTouches[0];
                  if (!touch) return;
                  startX = touch.clientX;
                  startY = touch.clientY;
                },
                { passive: true }
              );
              document.addEventListener(
                "touchend",
                (event) => {
                  const touch = event.changedTouches[0];
                  if (!touch) return;
                  const deltaX = touch.clientX - startX;
                  const deltaY = touch.clientY - startY;
                  const isHorizontalSwipe =
                    Math.abs(deltaX) >= 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2;

                  if (!isHorizontalSwipe) return;
                  if (deltaX < 0) void reader.next();
                  if (deltaX > 0) void reader.prev();
                },
                { passive: true }
              );
            });
          }

          reader.on("relocated", (nextLocation) => {
            const cfi = nextLocation.start?.cfi;
            if (cfi) reportFromCfi(cfi, nextLocation.start?.href);
          });

          void reader.book.locations.generate(1200).then(() => {
            locationsReadyRef.current = true;
            if (location) reportFromCfi(location);
          });
        }}
        epubOptions={{
          flow: readingMode === "paginated" ? "paginated" : "scrolled-doc",
          manager: readingMode === "paginated" ? "default" : "continuous",
          spread: "none",
          allowScriptedContent: false,
        }}
        handleKeyPress={() => undefined}
        epubViewStyles={{
          viewHolder: { position: "relative", width: "100%", height: "100%" },
          view: {
            width: "100%",
            maxWidth: readingMode === "scrolled" ? "840px" : "none",
            height: "100%",
            margin: "0 auto",
          },
        }}
        loadingView={
          <div className="absolute inset-0 flex justify-center items-center text-[#767268] text-sm tracking-wide">
            {loadingLabel}
          </div>
        }
        errorView={
          <div className="absolute inset-0 flex justify-center items-center px-8 text-red-800 text-sm text-center">
            {errorLabel}
          </div>
        }
      />
    );
  }
);
