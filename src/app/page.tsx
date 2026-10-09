import { getAllPosts } from "@/lib/posts";
import { sortPosts } from "@/lib/post-display";
import { HomePage } from "@/components/HomePage";

export default function Home() {
  const posts = sortPosts(getAllPosts());
  return <HomePage posts={posts} />;
}
