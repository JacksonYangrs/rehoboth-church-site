import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "線上敬拜 · 利河伯教會" };

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="WORSHIP · 線上敬拜"
      title="線上敬拜"
      verse={VERSE_COLUMNS.worship}
      description="主日敬拜、講道主題、詩歌敬拜與特別聚會的影音與講義，正在籌備中。願我們線上也能一同敬拜。"
    />
  );
}
