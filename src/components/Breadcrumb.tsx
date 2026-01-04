"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/app/(translate)/I18nProvider";
import { ChevronRight, Home } from "lucide-react";
import { useTitleStore } from "@/store/title";
import type { ComponentType } from "react";

// 修复 React 19 下 Lucide 图标的类型兼容性问题
const IconHome = Home as unknown as ComponentType<{ className?: string }>;
const IconChevronRight = ChevronRight as unknown as ComponentType<{
  className?: string;
}>;

export function Breadcrumb() {
  const pathname = usePathname();
  const { t } = useI18n();
  const { title: storeTitle } = useTitleStore();

  const paths = pathname.split("/").filter(Boolean);

  // 如果是在首页，不显示面包屑
  if (paths.length === 0) return null;

  return (
    <nav className="flex items-center space-x-2 py-4 text-muted-text text-sm">
      <Link
        href="/"
        className="flex items-center hover:text-foreground transition-colors"
      >
        <IconHome className="w-4 h-4" />
      </Link>

      {paths.map((path, index) => {
        const isLast = index === paths.length - 1;
        const href = `/${paths.slice(0, index + 1).join("/")}`;

        // 尝试从翻译文件中获取路由名称
        const translatedLabel = t(`menu.${path}`);
        const label =
          translatedLabel !== `menu.${path}`
            ? translatedLabel
            : path.charAt(0).toUpperCase() + path.slice(1);

        return (
          <div key={href} className="flex items-center space-x-2">
            <IconChevronRight className="opacity-50 w-4 h-4" />
            {isLast ? (
              <span className="max-w-[300px] font-medium text-foreground truncate">
                {storeTitle || label}
              </span>
            ) : (
              <Link
                href={href}
                className="hover:text-foreground transition-colors"
              >
                {label}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
