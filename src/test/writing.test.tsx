import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { WritingWorkspace } from "@/components/writing/WritingWorkspace";
import { formatSelection } from "@/lib/writing-format";

vi.mock("@/components/notion-converter/NotionConverter", () => ({
  NotionConverter: () => <div>Notion tool</div>,
}));
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("writing tool", () => {
  it("formats the selected text and numbered lists", () => {
    expect(formatSelection("hello world", 6, 11, "bold").value).toBe("hello **world**");
    expect(formatSelection("one\ntwo", 0, 7, "ordered").value).toBe("1. one\n2. two");
  });
  it("guards refresh and tool switching only while there is unpublished content", () => {
    render(<WritingWorkspace />);
    const clean = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(clean);
    expect(clean.defaultPrevented).toBe(false);
    fireEvent.change(screen.getByLabelText("正文"), { target: { value: "a thought" } });
    const dirty = new Event("beforeunload", { cancelable: true });
    window.dispatchEvent(dirty);
    expect(dirty.defaultPrevented).toBe(true);
    vi.spyOn(window, "confirm").mockReturnValue(false);
    fireEvent.click(screen.getByRole("button", { name: "Notion → MDX" }));
    expect(screen.getByLabelText("正文")).toHaveValue("a thought");
  });
  it("retains text on publication failure and removes the refresh guard after success", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false, json: async () => ({ error: "write failed" }) })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ path: "src/posts/Thoughts/note-test.md", url: "/blog/note-test" }),
      });
    vi.stubGlobal("fetch", fetchMock);
    render(<WritingWorkspace />);
    fireEvent.change(screen.getByLabelText("标题"), { target: { value: "A thought" } });
    fireEvent.change(screen.getByLabelText("正文"), { target: { value: "**Hello**" } });
    fireEvent.click(screen.getByRole("button", { name: "发布到首页" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("write failed");
    expect(screen.getByLabelText("正文")).toHaveValue("**Hello**");
    fireEvent.click(screen.getByRole("button", { name: "发布到首页" }));
    await screen.findByText("随笔已发布");
    expect(JSON.parse(fetchMock.mock.calls[0][1].body).requestId).toBe(
      JSON.parse(fetchMock.mock.calls[1][1].body).requestId
    );
    await waitFor(() => {
      const event = new Event("beforeunload", { cancelable: true });
      window.dispatchEvent(event);
      expect(event.defaultPrevented).toBe(false);
    });
  });
});
