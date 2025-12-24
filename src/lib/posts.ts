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
};

export type PostWithContent = PostItem & { content: string };

// 读取所有 mdx 文件名作为 slug
export function getAllPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .filter((file) => file.toLowerCase().endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/i, ""));
}

function readPost(slug: string): PostWithContent {
  const markdown = fs.readFileSync(path.join(postsDirectory, `${slug}.mdx`), "utf-8");
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

  return {
    slug,
    content,
    frontmatter: { ...frontmatter, title: normalizedTitle },
  };
}

export function getAllPosts(): PostItem[] {
  return getAllPostSlugs().map((slug) => {
    const { frontmatter } = readPost(slug);
    return { slug, frontmatter };
  });
}

export function getPostContent(slug: string): PostWithContent {
  return readPost(slug);
}
