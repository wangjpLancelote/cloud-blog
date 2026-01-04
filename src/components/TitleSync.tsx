"use client";

import { useTitleStore } from "@/store/title";
import { useEffect } from "react";

export function TitleSync({ title }: { title: string }) {
  const { setTitle, resetTitle } = useTitleStore();

  useEffect(() => {
    setTitle(title);
    return () => resetTitle();
  }, [title, setTitle, resetTitle]);

  return null;
}

