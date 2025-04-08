import type { NextConfig } from "next";
import withMDX from '@next/mdx';

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx'],
};

const mdx = withMDX({
  extension: /\.mdx?$/,
  options: {
    // mdx options
    remarkPlugins: [],
    rehypePlugins: [],
  },
})

export default mdx(nextConfig);
