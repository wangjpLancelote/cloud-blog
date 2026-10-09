import type { PostItem } from "@/lib/posts";

export function postTags(post: PostItem): string[] {
  const tags = post.frontmatter.tags;
  const values = Array.isArray(tags)
    ? tags
        .filter((tag): tag is string => typeof tag === "string" && !!tag.trim())
        .map((tag) => tag.trim())
    : typeof tags === "string"
      ? tags
          .split(/[,，]/)
          .map((tag) => tag.trim())
          .filter(Boolean)
      : [];
  return [...new Set(values.length ? values : post.category ? [post.category] : [])];
}

export function postDate(post: PostItem): string | undefined {
  const value = post.frontmatter.date;
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10);
}

export function sortPosts(posts: PostItem[]): PostItem[] {
  const timestamp = (post: PostItem) => {
    const raw = post.frontmatter.publishedAt ?? post.frontmatter.date;
    const value = typeof raw === "string" ? Date.parse(raw) : Number.NaN;
    return Number.isNaN(value) ? 0 : value;
  };
  return [...posts].sort((a, b) => timestamp(b) - timestamp(a) || a.slug.localeCompare(b.slug));
}

export function filterTags(post: PostItem): string[] {
  const tags = postTags(post);
  return tags.length ? tags : ["Notes"];
}

export function tagTone(tag: string): string {
  const known: Record<string, string> = {
    frontend: "blue",
    ai: "violet",
    thoughts: "rose",
    notes: "sand",
    blockchain: "green",
  };
  const key = tag.toLowerCase();
  if (known[key]) return known[key];
  const hash = Array.from(key).reduce((value, char) => (value * 31 + char.charCodeAt(0)) >>> 0, 0);
  return ["blue", "violet", "rose", "sand", "green"][hash % 5];
}
