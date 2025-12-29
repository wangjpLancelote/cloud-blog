"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { TranslateSwitcher } from "@/app/(translate)/Translate";

export function Navigation() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const main = document.querySelector("main");
    if (!main) return;

    const handleScroll = () => {
      setIsScrolled(main.scrollTop > 0);
    };

    main.addEventListener("scroll", handleScroll);
    return () => main.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "/blog", label: t("menu.blog") },
    { href: "/blockchain", label: t("menu.blockchain") },
    { href: "/learning", label: t("menu.learning") },
  ];

  return (
    <nav
      className={cn(
        "top-0 z-50 sticky flex justify-between items-center bg-white/50 backdrop-blur-md px-6 border-white/20 border-b h-16 transition-all duration-300 shrink-0",
        isScrolled ? "shadow-sm border-white/40 bg-white/70" : "shadow-none"
      )}
    >
      {/* Left spacer to keep center aligned */}
      <div className="hidden lg:flex flex-1" />

      {/* Center Nav Items */}
      <div className="flex items-center gap-2 bg-black/[0.03] shadow-[inset_0_1px_2px_rgba(0,0,0,0.05)] p-1.5 border border-black/[0.05] rounded-2xl">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "relative flex items-center px-4 sm:px-6 py-2 rounded-xl font-medium text-sm transition-all duration-300",
                isActive
                  ? "text-foreground bg-white shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] ring-1 ring-black/[0.02]"
                  : "text-muted-text hover:text-foreground hover:bg-white hover:shadow-[0_2px_8px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] hover:ring-1 hover:ring-black/[0.02]"
              )}
            >
              <span className="z-10 relative">{item.label}</span>
              <span className="absolute inset-0 bg-current opacity-0 group-active:opacity-5 rounded-xl transition-opacity" />
            </Link>
          );
        })}
      </div>

      {/* Right Translate Switcher */}
      <div className="flex flex-1 justify-end">
        <TranslateSwitcher />
      </div>
    </nav>
  );
}
