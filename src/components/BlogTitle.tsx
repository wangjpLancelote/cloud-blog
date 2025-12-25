"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";

export function BlogTitle() {
  const { t } = useI18n();
  return <h1 className="text-center">{t("layout.title")}</h1>;
}

