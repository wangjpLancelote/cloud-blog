import { createHash, randomUUID } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

export const publishSchema = z.object({
  requestId: z.string().uuid(),
  title: z.string().trim().min(1, "请输入标题").max(120, "标题最多 120 个字符"),
  body: z.string().trim().min(1, "请输入正文").max(200000, "正文过长"),
  description: z.string().trim().max(300).default(""),
  tags: z.array(z.string().trim().min(1).max(30)).max(8).default([]),
});

export class PublishConflict extends Error {}

export async function publishPost(
  input: unknown,
  postsRoot = path.join(process.cwd(), "src/posts")
) {
  const data = publishSchema.parse(input);
  const tags = [...new Set(data.tags)];
  const fingerprint = createHash("sha256")
    .update(
      JSON.stringify({ title: data.title, body: data.body, description: data.description, tags })
    )
    .digest("hex");
  const slug = `note-${data.requestId}`;
  const directory = path.join(postsRoot, "Thoughts");
  await fs.mkdir(directory, { recursive: true });
  const root = await fs.realpath(postsRoot);
  if ((await fs.realpath(directory)) !== path.join(root, "Thoughts"))
    throw new Error("Invalid writing directory");
  const target = path.join(directory, `${slug}.md`);
  const existing = async () => {
    const saved = matter(await fs.readFile(target, "utf8"));
    if (saved.data.publishFingerprint !== fingerprint)
      throw new PublishConflict("该发布请求已有文章，请先查看首页，再创建新的随笔。");
    return { slug, path: `src/posts/Thoughts/${slug}.md`, url: `/blog/${slug}` };
  };
  try {
    await fs.access(target);
    return await existing();
  } catch (error) {
    if (!(error instanceof Error && "code" in error && error.code === "ENOENT")) throw error;
  }
  const now = new Date();
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  // JSON is valid YAML: quoted values cannot escape into new frontmatter fields.
  const metadata = {
    title: data.title,
    date,
    publishedAt: now.toISOString(),
    description: data.description,
    tags: tags.length ? tags : ["随笔"],
    editor: "markdown",
    publishFingerprint: fingerprint,
  };
  const document = `---\n${Object.entries(metadata)
    .map(([key, value]) => `${key}: ${JSON.stringify(value)}`)
    .join("\n")}\n---\n\n${data.body}\n`;
  const temporary = path.join(directory, `.${slug}-${randomUUID()}.tmp`);
  try {
    await fs.writeFile(temporary, document, { flag: "wx" });
    // Publish a completely written file atomically; never overwrite an existing post.
    try {
      await fs.link(temporary, target);
    } catch (error) {
      if (error instanceof Error && "code" in error && error.code === "EEXIST")
        return await existing();
      throw error;
    }
  } finally {
    await fs.unlink(temporary).catch(() => {});
  }
  return { slug, path: `src/posts/Thoughts/${slug}.md`, url: `/blog/${slug}` };
}
