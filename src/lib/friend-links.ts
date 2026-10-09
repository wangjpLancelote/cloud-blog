import { FRIEND_LINKS, type FriendLink } from "@/constants/friend-links";

export const FRIEND_LINKS_STORAGE_KEY = "cloud-blog-friend-links";

export function normalizeFriendUrl(value: string): string {
  const input = value.trim();
  if (!input || /\s/.test(input)) throw new Error("invalidUrl");
  const url = new URL(/^[a-z][a-z\d+.-]*:/i.test(input) ? input : `https://${input}`);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    !url.hostname.includes(".") ||
    url.username ||
    url.password
  )
    throw new Error("invalidUrl");
  return url.href;
}

function urlKey(value: string): string {
  return normalizeFriendUrl(value).replace(/\/$/, "");
}

export function createFriendLink(name: string, url: string, existing: FriendLink[]): FriendLink {
  const title = name.trim();
  if (!title || title.length > 80) throw new Error("invalidTitle");
  let link: string;
  try {
    link = normalizeFriendUrl(url);
  } catch {
    throw new Error("invalidUrl");
  }
  if (existing.some((item) => urlKey(item.link) === urlKey(link))) throw new Error("duplicate");
  return { name: title, link };
}

export function readSavedFriendLinks(storage: Pick<Storage, "getItem">): FriendLink[] {
  try {
    const data: unknown = JSON.parse(storage.getItem(FRIEND_LINKS_STORAGE_KEY) ?? "[]");
    if (!Array.isArray(data)) return [];
    const links: FriendLink[] = [];
    for (const item of data) {
      if (!item || typeof item.name !== "string" || typeof item.link !== "string") continue;
      try {
        links.push(createFriendLink(item.name, item.link, [...FRIEND_LINKS, ...links]));
      } catch {
        /* Ignore invalid saved entries. */
      }
    }
    return links;
  } catch {
    return [];
  }
}
