"use client";

import { BlogTitle } from "@/components/BlogTitle";

export function SiteBanner() {
  return (
    <div className="relative bg-white shadow-card hover:shadow-glass border border-white/20 w-full max-w-none h-20 overflow-hidden transition-shadow duration-300">
      <div className="absolute inset-0 bg-mac-glass backdrop-blur-xl backdrop-saturate-150" />
      <div className="z-10 relative flex items-center px-6 h-full text-foreground">
        <div className="flex justify-center items-center w-full font-medium text-foreground/80 text-base text-center">
          <BlogTitle />
        </div>
      </div>
    </div>
  );
}
