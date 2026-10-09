import type { ReactNode } from "react";

export default function SectionLayout({ children }: { children: ReactNode }) {
  return <div className="reading-width section-page">{children}</div>;
}
