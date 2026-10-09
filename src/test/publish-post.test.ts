// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import matter from "gray-matter";
import { publishPost } from "@/lib/publish-post";

let root: string;
const input = {
  requestId: "26e1a6de-af07-4e3a-83d8-1a90f04a59e2",
  title: '随笔："今天"\n下一行',
  body: "## 一点想法\n\n**你好**，{世界}。\n\n1. 阅读\n2. 写作",
  tags: ["生活", "生活"],
  description: "今天的想法",
};
beforeEach(async () => {
  root = await fs.mkdtemp(path.join(os.tmpdir(), "cloud-publish-test-"));
});
afterEach(async () => {
  await fs.rm(root, { recursive: true, force: true });
});
describe("publish Markdown posts", () => {
  it("creates a readable Markdown file with safe frontmatter and an article URL", async () => {
    const result = await publishPost(input, root);
    const file = await fs.readFile(path.join(root, "Thoughts", `${result.slug}.md`), "utf8");
    const parsed = matter(file);
    expect(parsed.data.title).toBe(input.title);
    expect(parsed.data.tags).toEqual(["生活"]);
    expect(parsed.data.editor).toBe("markdown");
    expect(parsed.data.publishedAt).toBeTruthy();
    expect(parsed.content.trim()).toBe(input.body);
    expect(result.url).toBe(`/blog/${result.slug}`);
  });
  it("handles concurrent retries without duplicates or overwritten posts", async () => {
    const results = await Promise.all([publishPost(input, root), publishPost(input, root)]);
    expect(results[0]).toEqual(results[1]);
    expect(await fs.readdir(path.join(root, "Thoughts"))).toEqual([`${results[0].slug}.md`]);
    await expect(publishPost({ ...input, body: "changed" }, root)).rejects.toThrow("已有文章");
  });
  it("rejects empty content and invalid identifiers without creating files", async () => {
    await expect(publishPost({ ...input, body: " " }, root)).rejects.toThrow();
    await expect(publishPost({ ...input, requestId: "../../outside" }, root)).rejects.toThrow();
    expect(await fs.readdir(root)).toEqual([]);
  });
});
