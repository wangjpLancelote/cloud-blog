"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const OPTIONS: { value: "auto" | "en" | "zh"; labelKey: string }[] = [
  { value: "auto", labelKey: "auto" },
  { value: "en", labelKey: "english" },
  { value: "zh", labelKey: "chinese" },
];

export function TranslateSwitcher() {
  const { choice, setChoice, t } = useI18n();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2 rounded-md border bg-card px-3 py-2 text-sm shadow-sm">
      <span className="text-muted-foreground">{t("language")}</span>
      <div className="flex gap-1">
        {OPTIONS.map((opt) => (
          <Button
            key={opt.value}
            size="sm"
            variant={opt.value === choice ? "default" : "outline"}
            className={cn("px-3 py-1")}
            onClick={() => setChoice(opt.value)}
          >
            {t(opt.labelKey)}
          </Button>
        ))}
      </div>
    </div>
  );
}
