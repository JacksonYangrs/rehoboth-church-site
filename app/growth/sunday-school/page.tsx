import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "兒童主日學 · 利河伯教會" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "sunday-school")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="sunday-school"
      title="兒童主日學"
      verse={item.verse}
      intro="為 12 歲以下孩子預備的主日學：聖經故事、詩歌與品格教導，讓孩子從小走在當行的道上。"
      meta={[
        { label: "對象", value: "12 歲以下兒童" },
        { label: "聚會時間", value: "主日敬拜時段（詳見公告）" },
      ]}
    />
  );
}
