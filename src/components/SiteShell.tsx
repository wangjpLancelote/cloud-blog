"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Breadcrumb } from "@/components/Breadcrumb";
import { MusicPlayer } from "@/components/MusicPlayer";
import { ScrollToTop } from "@/components/ScrollToTop";
import { useI18n } from "@/app/(translate)/I18nProvider";
import Link from "next/link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "/";
  const { t } = useI18n();
  const reading = /^\/books\/[^/]+\/?$/.test(pathname);
  const mainRef = useRef<HTMLElement>(null);
  useEffect(() => {
    // Route changes now reset the content container instead of the window.
    mainRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, []);
  return (
    <div className={reading ? "site-shell reader-shell" : "site-shell"}>
      <a href="#app-main" className="skip-link">
        {t("site.skip")}
      </a>
      <Navigation />
      <main id="app-main" ref={mainRef} tabIndex={-1}>
        {!reading && pathname !== "/" && (
          <div className="reading-width inner-breadcrumb">
            <Breadcrumb />
          </div>
        )}
        {children}
        {!reading && (
          <footer className="site-footer reading-width">
            <div>
              <Link href="/" className="footer-brand">
                Cloud Blog<span aria-hidden="true"> · </span>
              </Link>
              <p>{t("site.footer")}</p>
            </div>
            <span>© {new Date().getFullYear()} Lorenzo Wang</span>
          </footer>
        )}
      </main>
      {!reading && (
        <>
          <MusicPlayer src="https://archive.org/download/freepd/Page2/Ambient%20C%20Motion.mp3" />
          <ScrollToTop />
        </>
      )}
    </div>
  );
}
