export type Book = {
  slug: string;
  title: string;
  author: string;
  category: string;
  description?: string;
  cover: string;
  epub: string;
  language: "zh" | "en";
};

export type ReaderTheme = "paper" | "sepia" | "dark";
export type ReaderFont = "serif" | "sans";

export type BookProgress = {
  cfi: string;
  percentage: number;
  chapter?: string;
  updatedAt: number;
};

export type ReaderPreferences = {
  theme: ReaderTheme;
  fontScale: number;
  lineHeight: number;
  fontFamily: ReaderFont;
};
