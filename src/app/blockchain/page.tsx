import { TopicPage } from "@/components/TopicPage";
import { getAllPosts } from "@/lib/posts";
import { sortPosts } from "@/lib/post-display";

const blockchainSlugs = new Set([
  "Contract",
  "DeFi",
  "farm",
  "GameFi",
  "LiquidityFarm",
  "oracle",
  "smartContract",
  "token",
  "wallet",
  "聚合器Yearn",
]);

export default function BlockchainPage() {
  return (
    <TopicPage
      topic="blockchain"
      posts={sortPosts(
        getAllPosts().filter(
          (post) => blockchainSlugs.has(post.slug) || post.category?.toLowerCase() === "blockchain"
        )
      )}
    />
  );
}
