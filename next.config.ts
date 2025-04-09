import type { NextConfig } from "next";
import withMDX from '@next/mdx';
import remarkGfm from "remark-gfm";

const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx', 'md'],
}

const mdx = withMDX({
  extension: /\.mdx?$/,
  options: {
    // mdx options
    remarkPlugins: [],
    rehypePlugins: [],
  },
})


export default mdx(nextConfig);
