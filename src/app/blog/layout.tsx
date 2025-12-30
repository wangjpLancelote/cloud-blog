import type { ReactNode } from "react";
export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col mx-auto px-4 lg:px-6 pt-6 pb-12 max-w-full 2xl:max-w-360 sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl min-h-screen">
      <main className="flex-1 mt-8">{children}</main>
    </div>
  );
}
