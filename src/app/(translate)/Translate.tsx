"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { Button } from "@/components/cloud-ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import type { ComponentType } from "react";

// 修复 React 19 下 Lucide 图标的类型兼容性问题
const IconGlobe = Globe as unknown as ComponentType<{ className?: string }>;

const OPTIONS: { value: "auto" | "en" | "zh"; labelKey: string }[] = [
  { value: "auto", labelKey: "auto" },
  { value: "en", labelKey: "english" },
  { value: "zh", labelKey: "chinese" },
];

export function TranslateSwitcher() {
  const { locale, choice, setChoice, t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getLabel = (opt: (typeof OPTIONS)[0]) => {
    if (opt.value === "auto" && choice === "auto") {
      const detected = locale === "zh" ? t("chinese") : t("english");
      return `${t("auto")} (${detected})`;
    }
    return t(opt.labelKey);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop Version */}
      <div className="hidden lg:flex items-center gap-1 bg-black/3 p-1 border border-black/5 rounded-xl">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setChoice(opt.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all",
              opt.value === choice
                ? "bg-white text-foreground shadow-sm ring-1 ring-black/2"
                : "text-muted-text hover:text-foreground hover:bg-white/40"
            )}
          >
            {getLabel(opt)}
          </button>
        ))}
      </div>

      {/* Mobile Version (Dropdown) */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/3 hover:bg-black/6 p-0 rounded-xl w-9 h-9"
          onClick={() => setIsOpen(!isOpen)}
        >
          <IconGlobe className="w-4 h-4" />
        </Button>

        {isOpen && (
          <div className="right-0 z-60 absolute bg-white shadow-glass mt-2 py-1 border border-black/5 rounded-xl w-48 animate-in duration-200 fade-in zoom-in">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setChoice(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "px-4 py-2 w-full text-sm text-left transition-colors",
                  opt.value === choice
                    ? "text-primary bg-primary/5 font-medium"
                    : "text-muted-text hover:bg-black/2 hover:text-foreground"
                )}
              >
                {getLabel(opt)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
