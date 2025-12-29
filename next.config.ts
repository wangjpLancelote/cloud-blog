import withMDX from "@next/mdx";
import type { NextConfig } from "next";
import rehypePrettyCode from "rehype-pretty-code";
import rehypePrism from "rehype-prism-plus";
import type { PluggableList } from "unified";

const options = {
  // 使用你喜欢的主题
  // 可以是一个字符串，或者一个包含 light/dark 模式的对象
  theme: {
    dark: "github-dark-dimmed",
    light: "github-light",
  },
  // 在代码块渲染时保持 `background-color`，即使主题中定义了
  // 这对于自定义代码块的背景很有用
  keepBackground: false,
  // 可以在这里传递给 shiki 的其他选项
  // ...
};

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "js", "jsx", "mdx", "md"],
  output: "export",
  images: {
    unoptimized: true,
  },
};

const mdx = withMDX({
  extension: /\.mdx?$/,
  options: {
    // mdx options
    remarkPlugins: [],
    rehypePlugins: [rehypePrism, rehypePrettyCode, options] as PluggableList,
  },
});

export default mdx(nextConfig);
