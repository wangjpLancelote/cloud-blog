import GiscusComment from "@/components/GisusComment";
import { getAllPostSlugs, getPostContent } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypePrettyCode from "rehype-pretty-code";
import Custom from "../../../components/Custom";
import Layout from "../../../components/Layout";

const options = {
  theme: {
    dark: "laserwave",
    light: "light-plus",
  },
  keepBackground: false,
};

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { content, frontmatter } = getPostContent(slug);

  return (
    <Layout>
      <article className="dark:prose-invert prose prose-lg">
        <h1>{frontmatter.title}</h1>
        <MDXRemote
          source={content}
          components={{ Custom }}
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
