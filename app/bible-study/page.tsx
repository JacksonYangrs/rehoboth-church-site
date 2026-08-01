import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";

export const metadata: Metadata = { title: "查经公告 · 利河伯教会" };

export default function Page() {
  return (
    <PlaceholderPage
      title="查经公告"
      description="每周查经主题、查考经文、日期时间与 Zoom 链接，以及带领同工与预备问题，正在筹备中。"
    />
  );
}
