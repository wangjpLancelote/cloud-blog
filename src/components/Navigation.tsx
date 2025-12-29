"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef, useMemo } from "react";
import { TranslateSwitcher } from "@/app/(translate)/Translate";

export function Navigation() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeRect, setActiveRect] = useState<{
    left: number;
    width: number;
  } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  const navItems = useMemo(
    () => [
      { href: "/blog", label: t("menu.blog") },
      { href: "/blockchain", label: t("menu.blockchain") },
      { href: "/learning", label: t("menu.learning") },
    ],
    [t]
  );

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const handleScroll = () => {
      setIsScrolled(main.scrollTop > 0);
    };

    main.addEventListener("scroll", handleScroll);
    return () => main.removeEventListener("scroll", handleScroll);
  }, []);

  // 计算激活项的位置
  useEffect(() => {
    const updateActiveRect = () => {
      const activeIndex = navItems.findIndex((item) =>
        pathname.startsWith(item.href)
      );
      const activeElement = itemsRef.current[activeIndex];
      const container = containerRef.current;

      if (activeElement && container) {
        const containerRect = container.getBoundingClientRect();
        const elementRect = activeElement.getBoundingClientRect();
        setActiveRect({
          left: elementRect.left - containerRect.left,
          width: elementRect.width,
        });
      }
    };

    updateActiveRect();
    // 监听窗口大小变化以重新计算
    window.addEventListener("resize", updateActiveRect);
    return () => window.removeEventListener("resize", updateActiveRect);
  }, [pathname, navItems]);

  return (
    <nav
      className={cn(
        "top-0 z-50 sticky flex justify-between items-center bg-white/50 backdrop-blur-md px-6 border-white/20 border-b h-16 transition-all duration-300 shrink-0",
        isScrolled ? "shadow-sm border-white/40 bg-white/70" : "shadow-none"
      )}
    >
      <div className="hidden lg:flex flex-1" />

      <div
        ref={containerRef}
        className="relative flex items-center gap-2 bg-black/[0.03] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] p-1.5 border border-black/[0.05] rounded-2xl"
      >
        {/* 滑动背景块 */}
        {activeRect && (
          <div
            className="top-1.5 bottom-1.5 absolute bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] rounded-xl ring-1 ring-black/[0.02] transition-all duration-300 ease-out"
            style={{
              left: activeRect.left,
              width: activeRect.width,
            }}
          />
        )}

        {navItems.map((item, index) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              ref={(el) => {
                itemsRef.current[index] = el;
              }}
              className={cn(
                "z-10 relative flex items-center px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-colors duration-300",
                isActive
                  ? "text-foreground"
                  : "text-muted-text hover:text-foreground"
              )}
            >
              <span>{item.label}</span>
              {/* Hover 效果：非激活状态下显示一个淡色背景 */}
              {!isActive && (
                <span className="-z-10 absolute inset-0 bg-white/0 hover:bg-white/40 rounded-xl transition-colors duration-300" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="flex flex-1 justify-end">
        <TranslateSwitcher />
      </div>
    </nav>
  );
}
