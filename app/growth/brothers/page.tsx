import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "弟兄團契 · 利河伯教會" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "brothers")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="brothers"
      title="弟兄團契"
      verse={item.verse}
      intro="弟兄們同奔天路、彼此擔當的團契：兩個人的勞碌同得美好的果效，一同成長。"
      meta={[{ label: "聚會時間", value: "詳見公告" }]}
    />
  );
}
