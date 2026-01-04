import { getAllPosts, getAllCategories } from "@/lib/posts";
import { BlogList } from "@/components/BlogList";

export default async function BlogIndex() {
  const posts = getAllPosts();
  const categories = getAllCategories();

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

  return <BlogList posts={sortedPosts} categories={categories} />;
}
