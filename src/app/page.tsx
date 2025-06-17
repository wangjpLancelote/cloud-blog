import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from '../components/Layout';

export default async function Home() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/posts'));
  const posts = files.map(filename => {
    const slug = filename.replace('.mdx', '');
    const markdownWithMeta = fs.readFileSync(path.join('src/posts', filename), 'utf-8');
    const { data: frontMatter } = matter(markdownWithMeta);
    return {
      slug,
      frontMatter
    };
  });

  return (
    <Layout>
      <h1>我的 MDX 博客 (App Router)</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>
              {post.frontMatter.title}
            </Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}
