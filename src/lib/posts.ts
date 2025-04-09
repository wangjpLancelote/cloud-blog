import fs from 'fs'
import path from 'path'

const postsDirectory = path.join(process.cwd(), 'src/posts') // posts 目录

// 读取所有 mdx 文件名作为 slug
export function getAllPostSlugs() {
  return fs.readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => file.replace(/\.mdx$/, ''))
}

// 动态 import 每篇文章
export function getPostBySlug(slug: string) {
  return import(`@/posts/${slug}.mdx`)
}
