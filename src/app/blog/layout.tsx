import type { ReactNode } from "react";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col mx-auto px-4 lg:px-6 pt-6 pb-12 max-w-5xl min-h-screen">
      <header className="relative bg-card shadow-sm border rounded-2xl h-[200px] overflow-hidden">
        {/* 背景：仅使用纯色与磨砂叠加，无背景图 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-indigo-800 to-purple-700 opacity-90" />
          <div className="absolute inset-0 bg-white/10 backdrop-blur-md" />
        </div>
      </header>

      <main className="flex-1 mt-8">
        <div className="bg-card/50 shadow-sm backdrop-blur p-6 border rounded-2xl">{children}</div>
      </main>
    </div>
  );
}
