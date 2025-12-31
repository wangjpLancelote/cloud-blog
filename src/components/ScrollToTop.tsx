"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    const mainEl = document.getElementById("app-main");
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: "auto" });
    } else if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [pathname]);

  return null;
}
