"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { Button } from "@/components/cloud-ui/button";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";

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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
      <div className="hidden lg:flex items-center gap-1 bg-black/[0.03] p-1 rounded-xl border border-black/[0.05]">
        {OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setChoice(opt.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap",
              opt.value === choice
                ? "bg-white text-foreground shadow-sm ring-1 ring-black/[0.02]"
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
          className="h-9 w-9 p-0 rounded-xl bg-black/[0.03] hover:bg-black/[0.06]"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Globe className="h-4 w-4" />
        </Button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-48 py-1 bg-white rounded-xl shadow-glass border border-black/[0.05] z-[60] animate-in fade-in zoom-in duration-200">
            {OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setChoice(opt.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-4 py-2 text-sm transition-colors",
                  opt.value === choice
                    ? "text-primary bg-primary/5 font-medium"
                    : "text-muted-text hover:bg-black/[0.02] hover:text-foreground"
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
