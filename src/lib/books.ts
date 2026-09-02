import { BOOKS } from "@/content/books";

export function getAllBooks() {
  return BOOKS;
}

export function getBookBySlug(slug: string) {
  return BOOKS.find((book) => book.slug === slug);
}

export function getBookCategories() {
  return Array.from(new Set(BOOKS.map((book) => book.category)));
}

export function getAllBookSlugs() {
  return BOOKS.map((book) => book.slug);
}
