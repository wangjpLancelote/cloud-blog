import type { ReactNode } from "react";

export default function BlockchainLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col mx-auto px-4 lg:px-6 pt-6 pb-12 max-w-5xl min-h-screen">
      {children}
    </div>
  );
}
