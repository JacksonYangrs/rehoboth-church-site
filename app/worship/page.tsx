import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";

export const metadata: Metadata = { title: "线上敬拜 · 利河伯教会" };

export default function Page() {
  return (
    <PlaceholderPage
      title="线上敬拜"
      description="主日敬拜、讲道主题、诗歌敬拜与特别聚会的影音与讲义，正在筹备中。愿我们线上也能一同敬拜。"
    />
  );
}
