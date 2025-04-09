import { notFound } from 'next/navigation'
import { getAllPostSlugs, getPostBySlug } from '@/lib/posts'
import GiscusComment from '@/components/GisusComment';

// 生成静态路由 这是用了next自带的静态路由生成方式生成对应的html路径
export function generateStaticParams() {
    const slugs = getAllPostSlugs();
    return slugs.map(slug => ({ slug }));
}

interface IBlogPage {
  params: Promise<{
    slug: string;
  }>
}

export default async function BlogPage({ params }: Readonly<IBlogPage>) {
  const { slug } = await params;
  if (!slug) {
    notFound() // 如果没有找到对应文章，返回 404
  }

  const MDXContent = (await getPostBySlug(slug)).default;

  return (
    <div className='mx-auto py-8 prose'>
      <MDXContent/>
      <div className='mt-12'>
        <GiscusComment />
      </div>
    </div>
  )
}