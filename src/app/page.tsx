import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import Layout from '../components/Layout';
import BlogHeader from '@/components/Header';

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
      <BlogHeader>
        <h1 className='text-center'>我的</h1>
      </BlogHeader>
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
