import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "認識教會 · 利河伯教會" };

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="ABOUT · 認識教會"
      title="認識教會"
      verse={VERSE_COLUMNS.about}
      description="教會簡介、異象與使命、信仰立場、牧者與同工、聚會時間與地點、新朋友指南，正在籌備中。歡迎你走進利河伯。"
    />
  );
}
