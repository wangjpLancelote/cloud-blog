import GiscusComment from "@/components/GisusComment";
import { getAllPostSlugs, getPostContent } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import Custom from "../../../components/Custom";
import Layout from "../../../components/Layout";
import { TitleSync } from "@/components/TitleSync";
import { mdxComponents } from "@/lib/mdx-components";
import { ScrollToTopOnMount } from "@/components/ScrollToTopOnMount";
import type { ComponentType } from "react";

type MDXProps = {
  source: string;
  components?: Record<string, unknown>;
  options?: unknown;
};

const options = {
  theme: {
    dark: "laserwave",
    light: "light-plus",
  },
  keepBackground: false,
};

export async function generateStaticParams() {
  // Next.js static export 需要 URL 编码的 slug，以避免中文等特殊字符缺失
  return getAllPostSlugs().map((slug) => ({ slug: encodeURIComponent(slug) }));
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const { content, frontmatter } = getPostContent(decodedSlug);
  const components = { Custom, ...mdxComponents };

  // 强制类型兼容，避免 React 19 下 async 组件类型检查失败
  const MDXRemoteComponent = MDXRemote as unknown as ComponentType<MDXProps>;

  return (
    <Layout>
      <ScrollToTopOnMount />
      <TitleSync title={frontmatter.title} />
      <article className="dark:prose-invert mx-auto w-full max-w-4xl md:max-w-5xl lg:max-w-5xl xl:max-w-6xl prose prose-lg">
        <h1 className="wrap-break-word hyphens-auto">{frontmatter.title}</h1>
        <MDXRemoteComponent
          source={content}
          components={components}
          options={{
            mdxOptions: {
              remarkPlugins: [],
              rehypePlugins: [[rehypePrettyCode, options]],
            },
          }}
        />
      </article>
      <GiscusComment />
    </Layout>
  );
}
