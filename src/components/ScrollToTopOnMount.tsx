"use client";

import { useEffect } from "react";

export function ScrollToTopOnMount() {
  useEffect(() => {
    // 获取滚动容器
    const scrollContainer = document.getElementById("app-main");
    
    if (scrollContainer) {
      // 立即滚动到顶部
      scrollContainer.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  }, []);

  return null;
}

