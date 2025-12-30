import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src/posts"); // posts 目录

export type PostFrontmatter = {
  title: string;
  date?: string;
  description?: string;
  [key: string]: unknown;
};

export type PostItem = {
  slug: string;
  frontmatter: PostFrontmatter;
  summary: string;
};

export type PostWithContent = PostItem & { content: string };

// 读取所有 md 或 mdx 文件名作为 slug，并进行去重
export function getAllPostSlugs() {
  const files = fs.readdirSync(postsDirectory);
  const slugs = files
    .filter((file) => {
      const lower = file.toLowerCase();
      return lower.endsWith(".mdx") || lower.endsWith(".md");
    })
    .map((file) => file.replace(/\.mdx?$/i, ""));

  // 使用 Set 去重
  return Array.from(new Set(slugs));
}

function readPost(slug: string): PostWithContent {
  let fullPath = path.join(postsDirectory, `${slug}.mdx`);
  if (!fs.existsSync(fullPath)) {
    fullPath = path.join(postsDirectory, `${slug}.md`);
  }

  const markdown = fs.readFileSync(fullPath, "utf-8");
  const { content, data } = matter(markdown);
  const frontmatter = data as PostFrontmatter;

  const formatTitleFromSlug = (value: string) =>
    value
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const fallbackTitle = formatTitleFromSlug(slug);
  const normalizedTitle =
    typeof frontmatter.title === "string" && frontmatter.title.trim().length > 0
      ? frontmatter.title
      : fallbackTitle;

  // 生成摘要：优先使用 description，否则截取内容前 150 个字符
  const summary =
    typeof frontmatter.description === "string" &&
    frontmatter.description.trim().length > 0
      ? frontmatter.description
      : `${content
          .replace(/[#*`]/g, "") // 移除简单的 markdown 符号
          .substring(0, 150)
          .trim()}...`;

  return {
    slug,
    content,
    summary,
    frontmatter: { ...frontmatter, title: normalizedTitle },
  };
}

export function getAllPosts(): PostItem[] {
  return getAllPostSlugs().map((slug) => {
    const { frontmatter, summary } = readPost(slug);
    return { slug, frontmatter, summary };
  });
}

export function getPostContent(slug: string): PostWithContent {
  return readPost(slug);
}
