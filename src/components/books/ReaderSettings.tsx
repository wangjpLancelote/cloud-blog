"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useReaderStore } from "@/store/reader";
import type { ReaderTheme } from "@/types/book";
import { Type } from "lucide-react";
import type { ComponentType } from "react";

const IconType = Type as unknown as ComponentType<{ className?: string }>;

const THEMES: Array<{
  id: ReaderTheme;
  background: string;
  foreground: string;
  label: string;
}> = [
  { id: "paper", background: "#f4f1e8", foreground: "#292821", label: "Aa" },
  { id: "sepia", background: "#e8dcc2", foreground: "#3c3326", label: "Aa" },
  { id: "dark", background: "#20211e", foreground: "#dedbd1", label: "Aa" },
];

export function ReaderSettings() {
  const { t } = useI18n();
  const {
    theme,
    fontScale,
    lineHeight,
    fontFamily,
    setTheme,
    setFontScale,
    setLineHeight,
    setFontFamily,
  } = useReaderStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex justify-center items-center hover:bg-black/7 rounded-full w-9 h-9 text-current transition-colors"
          aria-label={t("books.settings")}
          title={t("books.settings")}
        >
          <IconType className="w-[18px] h-[18px]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={10}
        className="bg-[#f8f5ec] shadow-xl p-5 border-[#c9c2b2] rounded-xl w-72 text-[#33342f]"
      >
        <h2 className="mb-5 font-serif font-semibold text-base">{t("books.settings")}</h2>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-3 text-xs">
              <span>{t("books.theme")}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {THEMES.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTheme(item.id)}
                  className={cn(
                    "flex justify-center items-center border rounded-lg h-10 font-serif transition-shadow",
                    theme === item.id ? "ring-2 ring-[#55574f] ring-offset-2" : "border-black/15"
                  )}
                  style={{
                    background: item.background,
                    color: item.foreground,
                  }}
                  aria-label={item.id}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-3 text-xs">
              <span>{t("books.fontSize")}</span>
              <span className="tabular-nums">{fontScale}%</span>
            </div>
            <Slider
              min={80}
              max={150}
              step={5}
              value={[fontScale]}
              onValueChange={([value]) => {
                if (value !== undefined) setFontScale(value);
              }}
              aria-label={t("books.fontSize")}
            />
          </div>

          <div>
            <div className="flex justify-between mb-3 text-xs">
              <span>{t("books.lineHeight")}</span>
              <span className="tabular-nums">{lineHeight.toFixed(1)}</span>
            </div>
            <Slider
              min={1.3}
              max={2.2}
              step={0.1}
              value={[lineHeight]}
              onValueChange={([value]) => {
                if (value !== undefined) setLineHeight(value);
              }}
              aria-label={t("books.lineHeight")}
            />
          </div>

          <div>
            <span className="block mb-2 text-xs">{t("books.font")}</span>
            <div className="grid grid-cols-2 bg-black/5 p-1 rounded-lg">
              {(["serif", "sans"] as const).map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => setFontFamily(font)}
                  className={cn(
                    "py-2 rounded-md text-xs transition-colors",
                    fontFamily === font ? "bg-white shadow-sm text-[#252620]" : "text-[#6f6d64]"
                  )}
                >
                  {t(`books.${font}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
