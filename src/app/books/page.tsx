import { Bookshelf } from "@/components/books/Bookshelf";
import { getAllBooks, getBookCategories } from "@/lib/books";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Books",
  description: "Cloud Blog 的数字书架与 EPUB 阅读器。",
};

export default function BooksPage() {
  return <Bookshelf books={getAllBooks()} categories={getBookCategories()} />;
}
