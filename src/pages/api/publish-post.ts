import type { NextApiRequest, NextApiResponse } from "next";
import { ZodError } from "zod";
import { publishPost, PublishConflict } from "@/lib/publish-post";

export const config = { api: { bodyParser: { sizeLimit: "1mb" } } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (process.env.NODE_ENV !== "development") return res.status(404).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "仅支持发布请求" });
  }
  // This tool writes to the checkout and is available only from this computer.
  const remote = req.socket.remoteAddress;
  const origin = req.headers.origin;
  const host = req.headers.host;
  let local = false;
  try {
    const address = new URL(origin ?? "");
    local =
      ["localhost", "127.0.0.1", "[::1]"].includes(address.hostname) &&
      address.host === host &&
      ["http:", "https:"].includes(address.protocol);
  } catch {
    /* Missing/invalid Origin is rejected. */
  }
  if (!local || !["127.0.0.1", "::1", "::ffff:127.0.0.1"].includes(remote ?? ""))
    return res.status(403).json({ error: "请通过本机 localhost 打开写作工具" });
  if (!req.headers["content-type"]?.startsWith("application/json"))
    return res.status(415).json({ error: "请求格式不正确" });
  try {
    return res.status(201).json(await publishPost(req.body));
  } catch (error) {
    if (error instanceof ZodError)
      return res.status(400).json({ error: error.issues[0]?.message ?? "文章内容不完整" });
    if (error instanceof PublishConflict) return res.status(409).json({ error: error.message });
    console.error("Could not publish post", error);
    return res
      .status(500)
      .json({ error: "未能写入文章文件，请检查本地项目权限后重试。内容仍保留在编辑器中。" });
  }
}
