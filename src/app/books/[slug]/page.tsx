import { TitleSync } from "@/components/TitleSync";
import { BookReader } from "@/components/books/BookReader";
import { getAllBookSlugs, getBookBySlug } from "@/lib/books";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type BookPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllBookSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { slug } = await params;
  const book = getBookBySlug(decodeURIComponent(slug));
  if (!book) return { title: "Book not found" };
  return {
    title: book.title,
    description: book.description,
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { slug } = await params;
  const book = getBookBySlug(decodeURIComponent(slug));
  if (!book) notFound();

  return (
    <>
      <TitleSync title={book.title} />
      <BookReader book={book} />
    </>
  );
}
