import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createFriendLink,
  DELETED_FRIEND_LINKS_STORAGE_KEY,
  FRIEND_LINKS_STORAGE_KEY,
  normalizeFriendUrl,
  readSavedFriendLinks,
} from "@/lib/friend-links";
import { FriendLinksDropdown } from "@/components/FriendLinksDropdown";
import { FRIEND_LINKS } from "@/constants/friend-links";

vi.mock("@/app/(translate)/I18nProvider", () => ({ useI18n: () => ({ t: (key: string) => key }) }));
vi.mock("sonner", () => ({ toast: { success: vi.fn() } }));

beforeEach(() => {
  localStorage.clear();
  vi.stubEnv("NODE_ENV", "development");
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

async function openManager() {
  fireEvent.keyDown(screen.getByRole("button", { name: "menu.friends" }), { key: "ArrowDown" });
  fireEvent.click(await screen.findByRole("menuitem", { name: "friendsForm.manage" }));
}

describe("friend links", () => {
  it("shows only friend links in production without add or management controls", async () => {
    vi.stubEnv("NODE_ENV", "production");
    render(<FriendLinksDropdown />);
    fireEvent.keyDown(screen.getByRole("button", { name: "menu.friends" }), { key: "ArrowDown" });
    expect(await screen.findByRole("menuitem", { name: /XPoet/ })).toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: /friendsForm.add/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("menuitem", { name: "friendsForm.manage" })).not.toBeInTheDocument();
    expect(screen.queryByRole("separator")).not.toBeInTheDocument();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
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
  it("deletes a custom link and keeps it removed after remount", async () => {
    localStorage.setItem(
      FRIEND_LINKS_STORAGE_KEY,
      JSON.stringify([
        { name: "My test blog", link: "https://example.com/" },
        { name: "Other blog", link: "https://other.example.com/" },
      ])
    );
    const view = render(<FriendLinksDropdown />);
    await openManager();
    fireEvent.click(screen.getByRole("button", { name: "friendsForm.delete My test blog" }));
    expect(screen.queryByText("My test blog")).not.toBeInTheDocument();
    expect(readSavedFriendLinks(localStorage)).toEqual([
      { name: "Other blog", link: "https://other.example.com/" },
    ]);
    view.unmount();
    render(<FriendLinksDropdown />);
    await openManager();
    expect(screen.queryByText("My test blog")).not.toBeInTheDocument();
    expect(screen.getByText("Other blog")).toBeInTheDocument();
  });
  it("persists deletion of built-in links, shows an empty state, and allows re-adding", async () => {
    const view = render(<FriendLinksDropdown />);
    await openManager();
    for (const item of FRIEND_LINKS) {
      fireEvent.click(screen.getByRole("button", { name: `friendsForm.delete ${item.name}` }));
    }
    expect(screen.getByText("menu.friendsEmpty")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(DELETED_FRIEND_LINKS_STORAGE_KEY) ?? "[]")).toEqual(
      FRIEND_LINKS.map((item) => item.link)
    );
    view.unmount();
    render(<FriendLinksDropdown />);
    fireEvent.keyDown(screen.getByRole("button", { name: "menu.friends" }), { key: "ArrowDown" });
    expect(await screen.findByText("menu.friendsEmpty")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("menuitem", { name: /friendsForm.add/ }));
    fireEvent.change(screen.getByLabelText("friendsForm.title"), { target: { value: "Restored" } });
    fireEvent.change(screen.getByLabelText("friendsForm.url"), {
      target: { value: FRIEND_LINKS[0].link },
    });
    fireEvent.click(screen.getByRole("button", { name: "friendsForm.save" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(readSavedFriendLinks(localStorage)).toEqual([
      { name: "Restored", link: FRIEND_LINKS[0].link },
    ]);
  });
  it("keeps the link visible when saving its deletion fails", async () => {
    localStorage.setItem(
      FRIEND_LINKS_STORAGE_KEY,
      JSON.stringify([{ name: "My test blog", link: "https://example.com/" }])
    );
    render(<FriendLinksDropdown />);
    await openManager();
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    fireEvent.click(screen.getByRole("button", { name: "friendsForm.delete My test blog" }));
    expect(screen.getByRole("alert")).toHaveTextContent("friendsForm.deleteError");
    expect(screen.getByText("My test blog")).toBeInTheDocument();
    expect(readSavedFriendLinks(localStorage)).toHaveLength(1);
  });
});
