"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { FRIEND_LINKS, type FriendLink } from "@/constants/friend-links";
import {
  createFriendLink,
  DELETED_FRIEND_LINKS_STORAGE_KEY,
  FRIEND_LINKS_STORAGE_KEY,
  readDeletedFriendLinks,
  readSavedFriendLinks,
} from "@/lib/friend-links";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { toast } from "sonner";

export function FriendLinksDropdown() {
  const { t } = useI18n();
  const canManage = process.env.NODE_ENV === "development";
  const [brokenAvatars, setBrokenAvatars] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<FriendLink[]>([]);
  const [deleted, setDeleted] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "manage">("add");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    const reload = () => {
      try {
        setSaved(readSavedFriendLinks(window.localStorage));
        setDeleted(readDeletedFriendLinks(window.localStorage));
      } catch {
        setSaved([]);
      }
      setReady(true);
    };
    reload();
    const onStorage = (event: StorageEvent) => {
      if (
        event.key === FRIEND_LINKS_STORAGE_KEY ||
        event.key === DELETED_FRIEND_LINKS_STORAGE_KEY ||
        event.key === null
      )
        reload();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canManage) return;
    setError("");
    let next: FriendLink[];
    try {
      const current = readSavedFriendLinks(window.localStorage);
      const hidden = readDeletedFriendLinks(window.localStorage);
      const item = createFriendLink(title, url, [
        ...FRIEND_LINKS.filter((item) => !hidden.includes(item.link)),
        ...current,
      ]);
      next = [...current, item];
    } catch (err) {
      const code =
        err instanceof Error && ["invalidTitle", "invalidUrl", "duplicate"].includes(err.message)
          ? err.message
          : "saveError";
      setError(t(`friendsForm.${code}`));
      return;
    }
    try {
      window.localStorage.setItem(FRIEND_LINKS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      setError(t("friendsForm.saveError"));
      return;
    }
    setSaved(next);
    setDialogOpen(false);
    toast.success(t("friendsForm.success"));
  };

  const links = [...FRIEND_LINKS.filter((item) => !deleted.includes(item.link)), ...saved];

  const deleteLink = (item: FriendLink) => {
    if (!canManage) return;
    setError("");
    try {
      const hidden = readDeletedFriendLinks(window.localStorage);
      // Built-in links are hidden locally; custom links are removed from storage.
      if (FRIEND_LINKS.some((link) => link.link === item.link) && !hidden.includes(item.link)) {
        const next = [...hidden, item.link];
        window.localStorage.setItem(DELETED_FRIEND_LINKS_STORAGE_KEY, JSON.stringify(next));
        setDeleted(next);
      } else {
        const next = readSavedFriendLinks(window.localStorage).filter(
          (link) => link.link !== item.link
        );
        window.localStorage.setItem(FRIEND_LINKS_STORAGE_KEY, JSON.stringify(next));
        setSaved(next);
      }
      toast.success(t("friendsForm.deleteSuccess"));
    } catch {
      setError(t("friendsForm.deleteError"));
    }
  };

  return (
    <>
      <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild>
          <button
            ref={trigger}
            type="button"
            className="friends-trigger"
            aria-label={t("menu.friends")}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              aria-hidden="true"
            >
              <path d="M10 13a5 5 0 0 0 7 .1l3-3a5 5 0 0 0-7-7l-2 2M14 11a5 5 0 0 0-7-.1l-3 3a5 5 0 0 0 7 7l2-2" />
            </svg>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          sideOffset={10}
          className="friends-menu"
          onCloseAutoFocus={(event) => {
            if (dialogOpen) event.preventDefault();
          }}
        >
          <div className="friends-list">
            {links.length === 0 && <p className="friend-empty">{t("menu.friendsEmpty")}</p>}
            {links.map((item) => (
              <DropdownMenuItem asChild key={item.link}>
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="friend-item"
                >
                  {item.avatar && !brokenAvatars[item.link] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.avatar}
                      alt=""
                      className="friend-initial"
                      loading="lazy"
                      onError={() =>
                        setBrokenAvatars((current) => ({ ...current, [item.link]: true }))
                      }
                    />
                  ) : (
                    <span className="friend-initial" aria-hidden="true">
                      {Array.from(item.name)[0]}
                    </span>
                  )}
                  <span className="friend-text">
                    <span className="friend-name">{item.name}</span>
                    <span className="friend-description">
                      {item.description || new URL(item.link).hostname}
                    </span>
                  </span>
                  <span aria-hidden="true">↗</span>
                </a>
              </DropdownMenuItem>
            ))}
          </div>
          {canManage && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={!ready}
                className="friend-add"
                onSelect={() => {
                  setTitle("");
                  setUrl("");
                  setError("");
                  setDialogMode("add");
                  setDialogOpen(true);
                }}
              >
                <span aria-hidden="true">＋</span>
                {t("friendsForm.add")}
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={!ready}
                className="friend-add"
                onSelect={() => {
                  setError("");
                  setDialogMode("manage");
                  setDialogOpen(true);
                }}
              >
                {t("friendsForm.manage")}
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {canManage && (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent
            className="friends-dialog"
            onCloseAutoFocus={(event) => {
              event.preventDefault();
              trigger.current?.focus();
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {t(`friendsForm.${dialogMode === "add" ? "add" : "manage"}`)}
              </DialogTitle>
              <DialogDescription>
                {t(`friendsForm.${dialogMode === "add" ? "description" : "manageDescription"}`)}
              </DialogDescription>
            </DialogHeader>
            {dialogMode === "manage" ? (
              <div className="friend-manage">
                {links.length === 0 && <p className="friend-empty">{t("menu.friendsEmpty")}</p>}
                {links.map((item) => (
                  <div className="friend-manage-item" key={item.link}>
                    <span className="friend-text">
                      <span className="friend-name">{item.name}</span>
                      <span className="friend-description">{item.link}</span>
                    </span>
                    <button
                      type="button"
                      className="friend-delete"
                      aria-label={`${t("friendsForm.delete")} ${item.name}`}
                      onClick={() => deleteLink(item)}
                    >
                      {t("friendsForm.delete")}
                    </button>
                  </div>
                ))}
                {error && (
                  <p className="friend-error" role="alert">
                    {error}
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={addLink} className="friend-form">
                <label htmlFor={`${id}-title`}>{t("friendsForm.title")}</label>
                <input
                  id={`${id}-title`}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  required
                  maxLength={80}
                  placeholder={t("friendsForm.titlePlaceholder")}
                />
                <label htmlFor={`${id}-url`}>{t("friendsForm.url")}</label>
                <input
                  id={`${id}-url`}
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  required
                  type="text"
                  inputMode="url"
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="https://example.com"
                  aria-describedby={error ? `${id}-error` : undefined}
                />
                {error && (
                  <p id={`${id}-error`} className="friend-error" role="alert">
                    {error}
                  </p>
                )}
                <div className="friend-form-actions">
                  <button type="button" onClick={() => setDialogOpen(false)}>
                    {t("friendsForm.cancel")}
                  </button>
                  <button type="submit">{t("friendsForm.save")}</button>
                </div>
              </form>
            )}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
