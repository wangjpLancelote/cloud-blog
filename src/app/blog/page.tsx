import { redirect } from "next/navigation";

// Keep old archive bookmarks working; the complete article list now lives at home.
export default function BlogIndex() {
  redirect("/");
}
