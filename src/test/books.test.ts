import { getAllBookSlugs, getAllBooks, getBookBySlug, getBookCategories } from "@/lib/books";
import { describe, expect, it } from "vitest";

describe("book catalogue", () => {
  it("keeps slugs unique and resolves each book", () => {
    const slugs = getAllBookSlugs();

    expect(new Set(slugs).size).toBe(slugs.length);
    for (const slug of slugs) {
      expect(getBookBySlug(slug)?.slug).toBe(slug);
    }
  });

  it("uses static, same-origin assets for exported pages", () => {
    for (const book of getAllBooks()) {
      expect(book.cover).toMatch(/^\/books\/covers\//);
      expect(book.epub).toMatch(/^\/books\/epubs\/.+\.epub$/);
    }
  });

  it("derives categories from the catalogue", () => {
    const expected = new Set(getAllBooks().map((book) => book.category));
    expect(new Set(getBookCategories())).toEqual(expected);
  });
});
