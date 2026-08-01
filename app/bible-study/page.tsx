import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "查經公告 · 利河伯教會" };

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="BIBLE STUDY · 查經公告"
      title="查經公告"
      verse={VERSE_COLUMNS["bible-study"]}
      description="每週查經主題、查考經文、日期時間與 Zoom 連結，以及帶領同工與預備問題，正在籌備中。"
    />
  );
}
