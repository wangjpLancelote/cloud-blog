"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { FRIEND_LINKS, type FriendLink } from "@/constants/friend-links";
import {
  createFriendLink,
  FRIEND_LINKS_STORAGE_KEY,
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
  const [brokenAvatars, setBrokenAvatars] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<FriendLink[]>([]);
  const [ready, setReady] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const trigger = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    const reload = () => {
      try {
        setSaved(readSavedFriendLinks(window.localStorage));
      } catch {
        setSaved([]);
      }
      setReady(true);
    };
    reload();
    const onStorage = (event: StorageEvent) => {
      if (event.key === FRIEND_LINKS_STORAGE_KEY || event.key === null) reload();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const addLink = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    let next: FriendLink[];
    try {
      const current = readSavedFriendLinks(window.localStorage);
      const item = createFriendLink(title, url, [...FRIEND_LINKS, ...current]);
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
            {[...FRIEND_LINKS, ...saved].map((item) => (
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
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={!ready}
            className="friend-add"
            onSelect={() => {
              setTitle("");
              setUrl("");
              setError("");
              setDialogOpen(true);
            }}
          >
            <span aria-hidden="true">＋</span>
            {t("friendsForm.add")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent
          className="friends-dialog"
          onCloseAutoFocus={(event) => {
            event.preventDefault();
            trigger.current?.focus();
          }}
        >
          <DialogHeader>
            <DialogTitle>{t("friendsForm.add")}</DialogTitle>
            <DialogDescription>{t("friendsForm.description")}</DialogDescription>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>
    </>
  );
}
