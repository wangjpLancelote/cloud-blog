"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState, useRef, useMemo } from "react";
import { TranslateSwitcher } from "@/app/(translate)/Translate";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FriendLinksDropdown } from "@/components/FriendLinksDropdown";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import type { ComponentType } from "react";

// Fix React 19 Lucide icon type compatibility
const IconMenu = Menu as unknown as ComponentType<{ className?: string }>;

export function Navigation() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
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
        "top-0 z-50 sticky flex items-center gap-4 bg-white/50 backdrop-blur-md px-4 lg:px-6 border-white/20 border-b h-16 transition-all duration-300 shrink-0",
        isScrolled ? "shadow-sm border-white/40 bg-white/70" : "shadow-none"
      )}
    >
      {/* 桌面端面包屑 */}
      <div className="hidden md:flex flex-1 min-w-0">
        <Breadcrumb />
      </div>

      {/* 桌面端导航 tab - 在移动端隐藏 */}
      <div
        ref={containerRef}
        className="hidden md:flex relative items-center gap-2 bg-black/3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] p-1.5 border border-black/5 rounded-2xl shrink-0"
      >
        {/* 滑动背景块 */}
        {activeRect && (
          <div
            className="top-1.5 bottom-1.5 absolute bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] rounded-xl ring-1 ring-black/2 transition-all duration-300 ease-out"
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

      {/* 右侧区域 */}
      <div className="flex flex-1 justify-end min-w-0">
        {/* 移动端面包屑 */}
        <div className="md:hidden flex-1 mr-2 min-w-0">
          <Breadcrumb />
        </div>
        
        {/* 语言切换和友链 */}
        <div className="flex items-center gap-2">
          <FriendLinksDropdown />
          <TranslateSwitcher />
          
          {/* 移动端菜单按钮 */}
          <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden bg-black/3 hover:bg-black/6 p-0 rounded-xl w-9 h-9"
                aria-label="打开菜单"
              >
                <IconMenu className="w-4 h-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 bg-white/98 backdrop-blur-xl border-l border-black/5">
              <SheetHeader>
                <SheetTitle className="text-left text-foreground/80">{t("menu.navigation")}</SheetTitle>
              </SheetHeader>
              <nav className="mt-8 flex flex-col gap-1">
                {navItems.map((item, index) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsDrawerOpen(false)}
                      className={cn(
                        "flex items-center px-4 py-3.5 rounded-xl font-medium text-base transition-all duration-200",
                        "animate-in fade-in slide-in-from-right-4",
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-text hover:bg-black/5 hover:text-foreground active:scale-[0.98]"
                      )}
                      style={{
                        animationDelay: `${80 + index * 60}ms`,
                        animationDuration: "350ms",
                        animationFillMode: "backwards",
                      }}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
