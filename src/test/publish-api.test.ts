// @vitest-environment node
import { afterEach, describe, expect, it, vi } from "vitest";
import type { NextApiRequest, NextApiResponse } from "next";
import handler from "@/pages/api/publish-post";

function request(overrides: Partial<NextApiRequest> = {}) {
  return {
    method: "POST",
    headers: {
      origin: "http://localhost:3000",
      host: "localhost:3000",
      "content-type": "application/json",
    },
    socket: { remoteAddress: "127.0.0.1" },
    body: {},
    ...overrides,
  } as NextApiRequest;
}
function response() {
  const res = { status: vi.fn(), setHeader: vi.fn(), json: vi.fn(), end: vi.fn() };
  res.status.mockReturnValue(res);
  return res;
}
afterEach(() => vi.unstubAllEnvs());
describe("local publishing boundary", () => {
  it("does not expose writing in production", async () => {
    vi.stubEnv("NODE_ENV", "production");
    const res = response();
    await handler(request(), res as unknown as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(404);
  });
  it("rejects foreign origins and requests from other computers", async () => {
    vi.stubEnv("NODE_ENV", "development");
    for (const req of [
      request({ headers: { origin: "https://outside.example", host: "localhost:3000" } }),
      request({ socket: { remoteAddress: "192.168.1.20" } as NextApiRequest["socket"] }),
    ]) {
      const res = response();
      await handler(req, res as unknown as NextApiResponse);
      expect(res.status).toHaveBeenCalledWith(403);
    }
  });
  it("rejects incomplete content without writing a file", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const res = response();
    await handler(request(), res as unknown as NextApiResponse);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
