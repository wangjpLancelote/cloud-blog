import { TopicPage } from "@/components/TopicPage";
import { getAllPosts } from "@/lib/posts";
import { sortPosts } from "@/lib/post-display";

export default function LearningPage() {
  return (
    <TopicPage
      topic="learning"
      posts={sortPosts(
        getAllPosts().filter(
          (post) =>
            ["Frontend", "AI", "Learning"].includes(post.category ?? "") || post.slug === "runners"
        )
      )}
    />
  );
}
