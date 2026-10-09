import { notFound } from "next/navigation";
import Layout from "@/components/Layout";
import { WritingWorkspace } from "@/components/writing/WritingWorkspace";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "写作工具",
  description:
    "Convert Notion pages to MDX format for Cloud Blog posts. Paste, preview, and download.",
};

export default function NotionConverterPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }

  return (
    <Layout>
      <WritingWorkspace />
    </Layout>
  );
}
