import { describe, expect, it } from "vitest";
import { postDate, postTags, sortPosts } from "@/lib/post-display";
import type { PostItem } from "@/lib/posts";

const post = (slug: string, date?: string): PostItem => ({ slug, frontmatter: { title: slug, date }, summary: "", wordCount: 0 });

describe("article list metadata", () => {
  it("does not fabricate a date for missing or invalid dates", () => {
    expect(postDate(post("missing"))).toBeUndefined();
    expect(postDate(post("invalid", "not-a-date"))).toBeUndefined();
  });
  it("sorts dated articles first without mutating the source", () => {
    const input = [post("undated"), post("older", "2025-01-01"), post("newer", "2026-08-07")];
    expect(sortPosts(input).map(item => item.slug)).toEqual(["newer", "older", "undated"]);
    expect(input[0].slug).toBe("undated");
  });
  it("uses explicit tags before the category and removes duplicate tags", () => {
    const item = { ...post("tagged"), category: "Frontend" };
    expect(postTags(item)).toEqual(["Frontend"]);
    item.frontmatter.tags = ["React", "React", "Web", null];
    expect(postTags(item)).toEqual(["React", "Web"]);
  });
});
