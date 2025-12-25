import { type ClassValue, clsx } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// 创建一个自定义的 merge 函数，让 tailwind-merge 识别复合工具类
const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      // 告诉它 gap-xs-regular 属于以下 Tailwind 类组
      // 这样当它与 text-lg 等类合并时，能正确识别并去重
      "font-size": ["gap-xs-regular"],
      "font-weight": ["gap-xs-regular"],
      "text-color": ["gap-xs-regular"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return customTwMerge(clsx(inputs));
}
