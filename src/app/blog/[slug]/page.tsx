'use client'
import { notFound } from 'next/navigation'

const posts: Record<string, any> = {
  'hello-world': () => import('./posts/hello-world.mdx'),
  'second-post': () => import('./posts/hello-world.mdx'),
}

export default async function BlogPostPage({ params }: Readonly<{ params: { slug: string } }>) {
  const post = posts[params.slug]

  if (!post) {
    notFound() // 如果没有找到对应文章，返回 404
  }

  const MDXContent = (await post()).default

  return (
    <div className='mx-auto py-8 prose'>
      <MDXContent/>
    </div>
  )
}