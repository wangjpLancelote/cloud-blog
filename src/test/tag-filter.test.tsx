import { fireEvent, render, screen } from "@testing-library/react";
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
