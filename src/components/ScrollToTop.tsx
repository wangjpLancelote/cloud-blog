"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // 获取实际的滚动容器
    const scrollContainer = document.getElementById("app-main") || window;

    const toggleVisibility = () => {
      // 获取滚动位置
      const scrollY =
        scrollContainer === window
          ? window.scrollY
          : (scrollContainer as HTMLElement).scrollTop;

      // 当滚动超过 400px 时显示按钮
      if (scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // 初始检查
    toggleVisibility();

    // 监听滚动事件
    scrollContainer.addEventListener("scroll", toggleVisibility, { passive: true });

    return () => {
      scrollContainer.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    const scrollContainer = document.getElementById("app-main") || window;

    if (scrollContainer === window) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } else {
      (scrollContainer as HTMLElement).scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <Button
      onClick={scrollToTop}
      className={cn(
        "fixed bottom-8 right-8 z-[100] rounded-full shadow-lg",
        "h-12 w-12 p-0 transition-all duration-300",
        "bg-primary text-primary-foreground hover:bg-primary/90"
      )}
      aria-label="回到顶部"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={2.5}
        stroke="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
        role="img"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 15.75l7.5-7.5 7.5 7.5"
        />
      </svg>
    </Button>
  );
}
