import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  createFriendLink,
  FRIEND_LINKS_STORAGE_KEY,
  normalizeFriendUrl,
  readSavedFriendLinks,
} from "@/lib/friend-links";
import { FriendLinksDropdown } from "@/components/FriendLinksDropdown";

vi.mock("@/app/(translate)/I18nProvider", () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

beforeEach(() => localStorage.clear());

describe("friend links", () => {
  it("normalizes websites and blocks unsafe or malformed URLs", () => {
    expect(normalizeFriendUrl(" example.com ")).toBe("https://example.com/");
    for (const url of [
      "javascript:alert(1)",
      "data:text/html,test",
      "file:///tmp/a",
      "hello",
      "https://user:password@example.com",
      "not a url",
    ])
      expect(() => normalizeFriendUrl(url)).toThrow();
  });
  it("checks titles and duplicates against existing links", () => {
    expect(() => createFriendLink(" ", "example.com", [])).toThrow("invalidTitle");
    expect(() =>
      createFriendLink("Same", "https://example.com", [
        { name: "Existing", link: "https://example.com/" },
      ])
    ).toThrow("duplicate");
  });
  it("restores valid custom links and tolerates corrupted storage", () => {
    localStorage.setItem(FRIEND_LINKS_STORAGE_KEY, "broken");
    expect(readSavedFriendLinks(localStorage)).toEqual([]);
    localStorage.setItem(
      FRIEND_LINKS_STORAGE_KEY,
      JSON.stringify([
        { name: "Example", link: "example.com" },
        { name: "Unsafe", link: "javascript:alert(1)" },
      ])
    );
    expect(readSavedFriendLinks(localStorage)).toEqual([
      { name: "Example", link: "https://example.com/" },
    ]);
  });
  it("adds a custom link through the form and retains it after remount", async () => {
    const view = render(<FriendLinksDropdown />);
    fireEvent.keyDown(screen.getByRole("button", { name: "menu.friends" }), { key: "ArrowDown" });
    fireEvent.click(await screen.findByRole("menuitem", { name: /friendsForm.add/ }));
    fireEvent.change(screen.getByLabelText("friendsForm.title"), {
      target: { value: "My test blog" },
    });
    fireEvent.change(screen.getByLabelText("friendsForm.url"), {
      target: { value: "example.com" },
    });
    fireEvent.click(screen.getByRole("button", { name: "friendsForm.save" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(readSavedFriendLinks(localStorage)).toEqual([
      { name: "My test blog", link: "https://example.com/" },
    ]);
    view.unmount();
    render(<FriendLinksDropdown />);
    fireEvent.keyDown(screen.getByRole("button", { name: "menu.friends" }), { key: "ArrowDown" });
    expect(await screen.findByRole("menuitem", { name: /My test blog/ })).toHaveAttribute(
      "href",
      "https://example.com/"
    );
  });
});
