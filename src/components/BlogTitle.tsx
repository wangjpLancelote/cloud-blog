"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { useEffect, useMemo, useState } from "react";

export function BlogTitle() {
  const { t } = useI18n();
  const fullText = useMemo(() => t("layout.title"), [t]);
  const [typedText, setTypedText] = useState(fullText);

  useEffect(() => {
    // Respect reduced-motion preferences
    if (typeof window !== "undefined") {
      const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)");
      if (reduced?.matches) {
        setTypedText(fullText);
        return;
      }
    }

    // Simple typewriter effect on mount / when text changes
    const delayMs = 120;
    const speedMs = 40;

    setTypedText("");
    let cancelled = false;
    let timer: number | undefined;

    const tick = (i: number) => {
      if (cancelled) return;
      setTypedText(fullText.slice(0, i));
      if (i < fullText.length) {
        timer = window.setTimeout(() => tick(i + 1), speedMs);
      }
    };

    const startTimer = window.setTimeout(() => tick(1), delayMs);

    return () => {
      cancelled = true;
      window.clearTimeout(startTimer);
      if (timer) window.clearTimeout(timer);
    };
  }, [fullText]);

  return (
    <h1 className="text-center">
      <span aria-hidden="true">{typedText}</span>
      <span className="sr-only">{fullText}</span>
    </h1>
  );
}
