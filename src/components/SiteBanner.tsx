"use client";

import { BlogTitle } from "@/components/BlogTitle";

export function SiteBanner() {
  return (
    <div className="relative bg-gradient-to-r from-[#1a0533] via-[#2d1b69] to-[#1a0533] border-b border-purple-500/20 w-full max-w-none h-20 overflow-hidden">
      {/* Purple ambient glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(139,92,246,0.25)_0%,transparent_70%)]" />
      {/* Brighter hot spot at center */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(192,132,252,0.15)_0%,transparent_50%)]" />

      <div className="z-10 relative flex items-center px-6 h-full">
        <div className="flex justify-center items-center w-full font-medium text-base text-center">
          <span className="text-white drop-shadow-[0_0_16px_rgba(192,132,252,0.7)]">
            <BlogTitle />
          </span>
        </div>
      </div>
    </div>
  );
}
