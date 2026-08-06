import { notFound } from "next/navigation";
import Layout from "@/components/Layout";
import { NotionConverter } from "@/components/notion-converter/NotionConverter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notion → MDX Converter",
  description:
    "Convert Notion pages to MDX format for Cloud Blog posts. Paste, preview, and download.",
};

export default function NotionConverterPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <Layout>
      <NotionConverter />
    </Layout>
  );
}
