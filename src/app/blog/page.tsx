import Link from 'next/link'

const posts = [
  { title: 'Hello World', slug: 'hello-world' },
  { title: 'Second Post', slug: 'second-post' },
]

export default function BlogPage() {
  return (
    <div>
      <h1>博客首页</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}