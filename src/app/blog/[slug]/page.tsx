import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Layout from '../../../components/Layout';
import Custom from '../../../components/Custom';
import GiscusComment from '@/components/GisusComment';
import rehypePrettyCode from 'rehype-pretty-code';

const options = {
  theme: {
    dark: 'laserwave',
    light: 'light-plus',
  },
  keepBackground: false, 
};

export async function generateStaticParams() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/posts'));
  return files.map(filename => ({
    slug: filename.replace('.mdx', '')
  }));
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const markdown = fs.readFileSync(path.join('src/posts', slug + '.mdx'), 'utf-8');
  const { content, data } = matter(markdown);

  return (
    <Layout>
        <article className="dark:prose-invert prose prose-lg">
            <h1>{data.title}</h1>
            <MDXRemote source={content} components={{ Custom }} options={{
              mdxOptions: {
                remarkPlugins: [],
                rehypePlugins: [
                  [ rehypePrettyCode, options ]
                ]
              },
            }} />
        </article>
      <GiscusComment />
    </Layout>
  );
}
