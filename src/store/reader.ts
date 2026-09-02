import type { BookProgress, ReaderFont, ReaderPreferences, ReaderTheme } from "@/types/book";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ReaderState = ReaderPreferences & {
  progress: Record<string, BookProgress>;
  setProgress: (slug: string, progress: BookProgress) => void;
  setTheme: (theme: ReaderTheme) => void;
  setFontScale: (fontScale: number) => void;
  setLineHeight: (lineHeight: number) => void;
  setFontFamily: (fontFamily: ReaderFont) => void;
};

export const useReaderStore = create<ReaderState>()(
  persist(
    (set) => ({
      progress: {},
      theme: "paper",
      fontScale: 100,
      lineHeight: 1.7,
      fontFamily: "serif",
      setProgress: (slug, progress) =>
        set((state) => ({
          progress: { ...state.progress, [slug]: progress },
        })),
      setTheme: (theme) => set({ theme }),
      setFontScale: (fontScale) => set({ fontScale }),
      setLineHeight: (lineHeight) => set({ lineHeight }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
    }),
    {
      name: "cloud-blog:reader:v1",
      storage: createJSONStorage(() => localStorage),
      partialize: ({ progress, theme, fontScale, lineHeight, fontFamily }) => ({
        progress,
        theme,
        fontScale,
        lineHeight,
        fontFamily,
      }),
    }
  )
);
