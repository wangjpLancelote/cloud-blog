import Link from 'next/link'
import { getAllPostSlugs } from '@/lib/posts'

export default function BlogPage() {
    const posts = getAllPostSlugs();
  return (
    <div>
      <h1>博客首页</h1>
      <ul>
        {posts.map((post) => (
          <li key={post}>
            <Link href={`/blog/${post}`}>{post}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}