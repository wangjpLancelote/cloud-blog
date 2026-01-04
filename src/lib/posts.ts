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
  category?: string;
};

export type PostWithContent = PostItem & { content: string };

type PostEntry = {
  slug: string;
  category?: string;
  fullPath: string;
};

function walkPosts(): PostEntry[] {
  const entries: PostEntry[] = [];

  function walk(dir: string, relativeDir = "") {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    for (const item of items) {
      const relPath = path.join(relativeDir, item.name);
      const fullPath = path.join(dir, item.name);

      if (item.isDirectory()) {
        walk(fullPath, relPath);
        continue;
      }

      const lower = item.name.toLowerCase();
      if (!lower.endsWith(".mdx") && !lower.endsWith(".md")) continue;

      const slug = item.name.replace(/\.mdx?$/i, "");
      const category = relativeDir ? relativeDir.split(path.sep)[0] : undefined;

      entries.push({ slug, category, fullPath });
    }
  }

  walk(postsDirectory);
  return entries;
}

// 读取所有 md/mdx 文件名作为 slug，并去重
export function getAllPostSlugs() {
  return Array.from(new Set(walkPosts().map((e) => e.slug)));
}

function readPost(slug: string): PostWithContent {
  // 解码 slug，处理中文字符被 URL 编码导致找不到文件的问题
  const decodedSlug = decodeURIComponent(slug);
  const entry = walkPosts().find((e) => e.slug === decodedSlug);
  if (!entry) {
    throw new Error(`Post not found for slug: ${decodedSlug}`);
  }

  const markdown = fs.readFileSync(entry.fullPath, "utf-8");
  const { content, data } = matter(markdown);
  const frontmatter = data as PostFrontmatter;

  const formatTitleFromSlug = (value: string) =>
    value
      .split(/[-_]/)
      .filter(Boolean)
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

  const fallbackTitle = formatTitleFromSlug(decodedSlug);
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
    slug: entry.slug,
    category: entry.category,
    content,
    summary,
    frontmatter: { ...frontmatter, title: normalizedTitle },
  };
}

export function getAllPosts(): PostItem[] {
  return walkPosts().map((entry) => {
    const { frontmatter, summary } = readPost(entry.slug);
    return {
      slug: entry.slug,
      category: entry.category,
      frontmatter,
      summary,
    };
  });
}

export function getPostContent(slug: string): PostWithContent {
  return readPost(slug);
}

export function getAllCategories(): { name: string; count: number }[] {
  const entries = walkPosts();

  // 已有文章的分类
  const postCats = entries
    .map((e) => e.category)
    .filter((c): c is string => !!c);

  // 顶层目录名（即使目录下暂时没有文章也要显示）
  const topDirs = fs
    .readdirSync(postsDirectory, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  const unique = Array.from(new Set([...topDirs, ...postCats]));

  const categories = unique.map((name) => ({
    name,
    count: entries.filter((e) => e.category === name).length,
  }));

  // "All" 计算所有文章数量
  const allCount = entries.length;
  return [{ name: "All", count: allCount }, ...categories];
}
