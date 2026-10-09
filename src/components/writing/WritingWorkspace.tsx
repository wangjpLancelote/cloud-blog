"use client";

import { useEffect, useRef, useState } from "react";
import { BlogWriter } from "./BlogWriter";
import { NotionConverter } from "@/components/notion-converter/NotionConverter";

const LEAVE_MESSAGE = "还有未发布的内容，离开后会丢失。确定离开吗？";
export function WritingWorkspace() {
  const [mode, setMode] = useState<"write" | "notion">("write");
  const [dirty, setDirty] = useState(false);
  const dirtyRef = useRef(false);
  dirtyRef.current = dirty;
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (!dirtyRef.current) return;
      event.preventDefault();
      event.returnValue = "";
    };
    const onLinkClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        !dirtyRef.current
      )
        return;
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (
        !(target instanceof HTMLAnchorElement) ||
        target.target === "_blank" ||
        target.hasAttribute("download")
      )
        return;
      if (
        target.origin === location.origin &&
        target.pathname === location.pathname &&
        target.search === location.search
      )
        return;
      if (!window.confirm(LEAVE_MESSAGE)) {
        event.preventDefault();
        event.stopPropagation();
      } else dirtyRef.current = false;
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", onLinkClick, true);
    return () => {
      window.removeEventListener("beforeunload", beforeUnload);
      document.removeEventListener("click", onLinkClick, true);
    };
  }, [dirty]);
  const changeMode = (next: "write" | "notion") => {
    if (next === mode || (dirty && !window.confirm(LEAVE_MESSAGE))) return;
    setDirty(false);
    setMode(next);
  };
  return (
    <div className="writing-workspace">
      <fieldset className="writing-tabs" aria-label="写作工具">
        <button type="button" aria-pressed={mode === "write"} onClick={() => changeMode("write")}>
          写博客
        </button>
        <button type="button" aria-pressed={mode === "notion"} onClick={() => changeMode("notion")}>
          Notion → MDX
        </button>
      </fieldset>
      {mode === "write" ? (
        <BlogWriter onDirtyChange={setDirty} />
      ) : (
        <NotionConverter onDirtyChange={setDirty} />
      )}
    </div>
  );
}
