import { getAllPosts } from "@/lib/posts";
import { PostCard } from "@/components/PostCard";

export default async function BlogIndex() {
  const posts = getAllPosts();

  // 按日期排序（如果有的话）
  const sortedPosts = posts.sort((a, b) => {
    if (a.frontmatter.date && b.frontmatter.date) {
      return (
        new Date(b.frontmatter.date).getTime() -
        new Date(a.frontmatter.date).getTime()
      );
    }
    return 0;
  });

  return (
    <div className="gap-6 grid py-6">
      {sortedPosts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
