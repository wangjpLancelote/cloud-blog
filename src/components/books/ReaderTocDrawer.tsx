"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import type { ReaderTocItem } from "@/components/books/EpubReaderAdapter";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

type ReaderTocDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  toc: ReaderTocItem[];
  onSelect: (href: string) => void;
};

function TocItems({
  items,
  depth = 0,
  onSelect,
}: {
  items: ReaderTocItem[];
  depth?: number;
  onSelect: (href: string) => void;
}) {
  return items.map((item) => (
    <div key={`${item.href}-${item.label}`}>
      <button
        type="button"
        onClick={() => onSelect(item.href)}
        className="hover:bg-black/5 px-3 py-2.5 rounded-lg w-full text-[#3e3e37] text-sm text-left transition-colors"
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {item.label.trim()}
      </button>
      {item.subitems && item.subitems.length > 0 && (
        <TocItems items={item.subitems} depth={depth + 1} onSelect={onSelect} />
      )}
    </div>
  ));
}

export function ReaderTocDrawer({ open, onOpenChange, toc, onSelect }: ReaderTocDrawerProps) {
  const { t } = useI18n();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="bg-[#f4f1e8] px-4 pt-6 pb-4 border-r-[#c9c2b2] w-[86vw] sm:max-w-sm"
      >
        <SheetHeader className="px-2 pb-4 border-black/10 border-b">
          <SheetTitle className="font-serif text-[#2c2d28]">{t("books.contents")}</SheetTitle>
        </SheetHeader>
        <div className="mt-4 h-[calc(100dvh-7rem)] overflow-y-auto">
          {toc.length > 0 ? (
            <TocItems
              items={toc}
              onSelect={(href) => {
                onSelect(href);
                onOpenChange(false);
              }}
            />
          ) : (
            <p className="px-3 py-6 text-[#777368] text-sm">{t("books.emptyToc")}</p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
