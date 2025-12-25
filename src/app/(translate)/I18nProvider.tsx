"use client";

import enDict from "@/i18n/dictionaries/en.json";
import zhDict from "@/i18n/dictionaries/zh.json";
import type { Locale, LocaleChoice, LocaleState } from "@/store/locale";
import { useLocaleStore } from "@/store/locale";
import { createContext, useContext, useEffect, useMemo } from "react";

type I18nContextValue = {
  locale: Locale;
  choice: LocaleChoice;
  setChoice: (value: LocaleChoice) => void;
  t: (key: string) => string;
};

const dictionaries: Record<Locale, Record<string, unknown>> = {
  en: enDict,
  zh: zhDict,
};

const I18nContext = createContext<I18nContextValue | null>(null);

function getByPath(obj: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object" && key in acc) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, obj);
}

function resolveLocale(choice: LocaleChoice): Locale {
  if (choice !== "auto") return choice;
  if (typeof navigator === "undefined") return "en";
  const navLang = navigator.language?.toLowerCase() ?? "";
  if (navLang.startsWith("zh")) return "zh";
  return "en";
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const choice = useLocaleStore((state: LocaleState) => state.choice);
  const setChoice = useLocaleStore((state: LocaleState) => state.setChoice);

  const locale = useMemo(() => resolveLocale(choice), [choice]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = choice === "auto" ? "auto" : locale;
  }, [choice, locale]);

  const messages = useMemo(() => dictionaries[locale], [locale]);

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      choice,
      setChoice,
      t: (key: string) => {
        const hit = getByPath(messages, key);
        return typeof hit === "string" ? hit : key;
      },
    }),
    [locale, choice, messages, setChoice]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
