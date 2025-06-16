import type { NextConfig } from "next";
import withMDX from '@next/mdx';
import rehypePrism from 'rehype-prism-plus';
import type { PluggableList } from "unified";


const nextConfig: NextConfig = {
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'mdx', 'md'],
}

const mdx = withMDX({
  extension: /\.mdx?$/,
  options: {
    // mdx options
    remarkPlugins: [],
    rehypePlugins: [rehypePrism ] as PluggableList,
  },
})


export default mdx(nextConfig);
