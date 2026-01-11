import type { Metadata, Viewport } from "next";
import "./(style)/tailwind.css";
import "./(style)/base.css";
import "./(style)/components.css";
import "./(style)/utilities.css";
import { I18nProvider } from "@/app/(translate)/I18nProvider";
import { AppToaster } from "@/components/cloud-ui/toaster";
import { StoreProvider } from "@/store/provider";
import { geist, geistMono } from "./(style)/fonts";
import { Navigation } from "@/components/Navigation";
import { SiteBanner } from "@/components/SiteBanner";

export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  title: {
    default: "Cloud Blog",
    template: "%s | Cloud Blog",
  },
  description: "Lorenzo Wang 的个人博客与知识库，记录区块链、前端与成长思考。",
  keywords: ["blog", "blockchain", "learning", "frontend", "web"],
  openGraph: {
    title: "Cloud Blog",
    description:
      "Lorenzo Wang 的个人博客与知识库，记录区块链、前端与成长思考。",
    url: "https://lorenzo-wang.pages.dev/blog",
    siteName: "Cloud Blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cloud Blog",
    description:
      "Lorenzo Wang 的个人博客与知识库，记录区块链、前端与成长思考。",
  },
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/apple-touch-icon.png" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${geistMono.variable} antialiased text-foreground bg-[radial-gradient(circle_at_20%_20%,rgba(245,250,255,0.92),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(190,215,245,0.55),transparent_32%),radial-gradient(circle_at_40%_90%,rgba(220,235,250,0.65),transparent_36%)] bg-slate-50/90 h-screen overflow-hidden flex flex-col`}
      >
        <AppToaster />
        <StoreProvider>
          <I18nProvider>
            <Navigation />
            <main
              id="app-main"
              className="flex-1 overflow-x-hidden overflow-y-auto"
            >
              <SiteBanner />
              {children}
            </main>
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
