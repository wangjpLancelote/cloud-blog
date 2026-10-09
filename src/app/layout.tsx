import type { Metadata, Viewport } from "next";
import "./(style)/tailwind.css";
import "./(style)/base.css";
import "./(style)/components.css";
import "./(style)/utilities.css";
import { I18nProvider } from "@/app/(translate)/I18nProvider";
import { AppToaster } from "@/components/cloud-ui/toaster";
import { StoreProvider } from "@/store/provider";
import { geist, geistMono } from "./(style)/fonts";
import { SiteShell } from "@/components/SiteShell";



export const viewport: Viewport = {
  themeColor: "#FDFCFB",
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
    url: "https://lorenzo-wang.pages.dev",
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
        className={`${geist.variable} ${geistMono.variable} antialiased site-body`}
      >
        <AppToaster />
        <StoreProvider>
          <I18nProvider>
            <SiteShell>{children}</SiteShell>
          </I18nProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
