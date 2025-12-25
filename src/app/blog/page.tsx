import Layout from "@/components/Layout";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export default async function BlogIndex() {
  const posts = getAllPosts();
  return (
    <Layout>
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
