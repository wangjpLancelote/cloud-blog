"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { TranslateSwitcher } from "@/app/(translate)/Translate";
import { FriendLinksDropdown } from "@/components/FriendLinksDropdown";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export function Navigation() {
  const { t } = useI18n();
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const items = [
    ["/", "home"],
    ["/blockchain", "blockchain"],
    ["/learning", "learning"],
    ["/books", "books"],
  ];
  const active = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="site-brand" aria-label="Cloud Blog">
          <span className="brand-mark" aria-hidden="true">
            c.
          </span>
        </Link>
        <nav className="desktop-nav" aria-label={t("menu.navigation")}>
          {items.map(([href, key]) => (
            <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
              {t(`menu.${key}`)}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {process.env.NODE_ENV === "development" && (
            <Link
              className="dev-tool"
              href="/tools/notion-converter"
              aria-label="写作工具"
              title="写博客 / Notion → MDX"
            >
              ✎
            </Link>
          )}
          <FriendLinksDropdown />
          <TranslateSwitcher />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button type="button" className="mobile-menu" aria-label={t("menu.navigation")}>
                <svg
                  width="19"
                  height="19"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M4 8h16M4 16h16" />
                </svg>
              </button>
            </SheetTrigger>
            <SheetContent className="warm-drawer">
              <SheetHeader>
                <SheetTitle>Cloud Blog</SheetTitle>
              </SheetHeader>
              <nav className="drawer-nav" aria-label={t("menu.navigation")}>
                {items.map(([href, key]) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active(href) ? "page" : undefined}
                  >
                    {t(`menu.${key}`)}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
