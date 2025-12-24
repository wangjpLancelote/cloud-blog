import Link from 'next/link';
import Layout from '@/components/Layout';
import BlogHeader from '@/components/Header';
import { getAllPosts } from '@/lib/posts';

export default async function BlogIndex() {
  const posts = getAllPosts();

  return (
    <Layout>
      <BlogHeader>
        <h1 className="text-center">我的</h1>
      </BlogHeader>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.frontmatter.title}</Link>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

