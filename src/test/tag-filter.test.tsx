import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FilterablePosts } from "@/components/FilterablePosts";
import type { PostItem } from "@/lib/posts";

vi.mock("@/app/(translate)/I18nProvider", () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock("@/components/PostCard", () => ({
  PostCard: ({ post }: { post: PostItem }) => <article>{post.frontmatter.title}</article>,
}));

const posts: PostItem[] = [
  {
    slug: "one",
    frontmatter: { title: "First", tags: ["React", "Web"] },
    category: "Frontend",
    summary: "",
    wordCount: 1,
  },
  { slug: "two", frontmatter: { title: "Second", tags: ["AI"] }, summary: "", wordCount: 1 },
  { slug: "three", frontmatter: { title: "Third" }, summary: "", wordCount: 1 },
];

describe("tag filters", () => {
  it("lists only the three most recent articles independently of the selected tag", () => {
    const datedPosts = ["2026-01-01", "2026-04-01", "2026-03-01", "2026-02-01"].map(
      (date, index) => ({
        ...posts[index % posts.length],
        slug: `post-${index}`,
        frontmatter: { title: `Post ${index}`, date, tags: [index === 0 ? "Old" : "New"] },
      })
    );
    render(<FilterablePosts posts={datedPosts} />);
    const recent = within(screen.getByRole("region", { name: "site.recent" }));
    expect(recent.getAllByRole("link").map((link) => link.textContent)).toEqual([
      "Post 1",
      "Post 2",
      "Post 3",
    ]);
    expect(recent.getAllByRole("link")[0]).toHaveAttribute("href", "/blog/post-1");
    fireEvent.click(screen.getByRole("button", { name: "Old 1" }));
    expect(recent.getAllByRole("link")).toHaveLength(3);
    expect(screen.getAllByRole("article")).toHaveLength(1);
  });

  it("shows only the available articles when fewer than three exist", () => {
    render(<FilterablePosts posts={posts.slice(0, 2)} />);
    const recent = within(screen.getByRole("region", { name: "site.recent" }));
    expect(recent.getAllByRole("link")).toHaveLength(2);
  });

  it("shows all articles initially and restores all after tag filtering", () => {
    render(<FilterablePosts posts={posts} />);
    expect(screen.getAllByRole("article")).toHaveLength(3);
    fireEvent.click(screen.getByRole("button", { name: "AI 1" }));
    expect(screen.getByRole("article").textContent).toBe("Second");
    expect(screen.getByRole("button", { name: "AI 1" })).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(screen.getByRole("button", { name: "Web 1" }));
    expect(screen.getByRole("article").textContent).toBe("First");
    fireEvent.click(screen.getByRole("button", { name: "site.notes 1" }));
    expect(screen.getByRole("article").textContent).toBe("Third");
    fireEvent.click(screen.getByRole("button", { name: "site.all 3" }));
    expect(screen.getAllByRole("article")).toHaveLength(3);
  });
});
