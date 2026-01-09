"use client";

import { useI18n } from "@/app/(translate)/I18nProvider";
import { Button } from "@/components/cloud-ui/button";
import { FRIEND_LINKS } from "@/constants/friend-links";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown, Link2, User } from "lucide-react";
import type { ComponentType } from "react";

// Fix React 19 Lucide icon type compatibility
const IconLink2 = Link2 as unknown as ComponentType<{ className?: string }>;
const IconChevronDown = ChevronDown as unknown as ComponentType<{
  className?: string;
}>;
const IconUser = User as unknown as ComponentType<{ className?: string }>;
const IconArrowUpRight = ArrowUpRight as unknown as ComponentType<{
  className?: string;
}>;

export function FriendLinksDropdown() {
  const { t } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const [brokenAvatar, setBrokenAvatar] = useState<Record<string, boolean>>({});
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const cancelScheduledClose = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const scheduleClose = (delayMs = 120) => {
    cancelScheduledClose();
    closeTimerRef.current = window.setTimeout(() => {
      setIsOpen(false);
      closeTimerRef.current = null;
    }, delayMs);
  };

  const links = useMemo(() => {
    return FRIEND_LINKS.map((l) => ({
      ...l,
      external: /^https?:\/\//.test(l.link),
    }));
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Desktop trigger (hover) */}
      <div className="hidden lg:flex items-center bg-black/3 p-1 border border-black/5 rounded-xl">
        <button
          type="button"
          onMouseEnter={() => {
            cancelScheduledClose();
            setIsOpen(true);
          }}
          onMouseLeave={() => scheduleClose()}
          onClick={() => setIsOpen((v) => !v)}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium text-xs whitespace-nowrap transition-all",
            isOpen
              ? "bg-white text-foreground shadow-sm ring-1 ring-black/2"
              : "text-muted-text hover:text-foreground hover:bg-white/40"
          )}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <span>{t("menu.friends")}</span>
          <IconChevronDown
            className={cn(
              "w-3.5 h-3.5 transition-transform",
              isOpen ? "rotate-180" : "rotate-0"
            )}
          />
        </button>
      </div>

      {/* Mobile trigger (click) */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="sm"
          className="bg-black/3 hover:bg-black/6 p-0 rounded-xl w-9 h-9"
          onClick={() => setIsOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
        >
          <IconLink2 className="w-4 h-4" />
        </Button>
      </div>

      {isOpen && (
        <div
          className={cn(
            "right-0 z-60 absolute bg-white shadow-glass mt-2 py-1 border border-black/5 rounded-xl w-56 animate-in duration-200 fade-in zoom-in"
          )}
          role="menu"
          onMouseEnter={() => cancelScheduledClose()}
          onMouseLeave={() => scheduleClose()}
        >
          {links.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-text">
              {t("menu.friendsEmpty")}
            </div>
          ) : (
            links.map((item) => {
              const commonClassName =
                "group flex items-center gap-3 px-4 py-2 w-full text-left rounded-lg transition-all duration-150 ease-out " +
                "bg-white/0 ring-1 ring-black/0 shadow-none " +
                "hover:bg-black/6 hover:ring-black/8 hover:shadow-[0_6px_14px_rgba(0,0,0,0.10),0_2px_6px_rgba(0,0,0,0.06)] " +
                "active:translate-y-[1px] active:shadow-[inset_0_2px_6px_rgba(0,0,0,0.14)] " +
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40";

              const showAvatar = Boolean(item.avatar) && !brokenAvatar[item.link];

              const content = (
                <>
                  {showAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="rounded-full w-8 h-8 object-cover shrink-0 ring-1 ring-black/5"
                      loading="lazy"
                      onError={() => {
                        setBrokenAvatar((prev) => ({
                          ...prev,
                          [item.link]: true,
                        }));
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center rounded-full w-8 h-8 bg-black/5 shrink-0 ring-1 ring-black/5">
                      <IconUser className="w-4 h-4 text-muted-text" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-foreground truncate">
                      {item.name}
                    </div>
                    {item.description ? (
                      <div className="text-xs text-muted-text truncate">
                        {item.description}
                      </div>
                    ) : null}
                  </div>
                  <IconArrowUpRight
                    className="w-4 h-4 text-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                    aria-hidden="true"
                  />
                </>
              );

              if (item.external) {
                return (
                  <a
                    key={item.link}
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    className={commonClassName}
                    role="menuitem"
                    onClick={() => setIsOpen(false)}
                  >
                    {content}
                  </a>
                );
              }

              return (
                <Link
                  key={item.link}
                  href={item.link}
                  className={commonClassName}
                  role="menuitem"
                  onClick={() => setIsOpen(false)}
                >
                  {content}
                </Link>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}


