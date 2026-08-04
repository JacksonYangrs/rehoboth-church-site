import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "弟兄团契 · 利河伯教会" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "brothers")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="brothers"
      title="弟兄团契"
      verse={item.verse}
      intro="弟兄们同奔天路、彼此担当的团契：两个人的劳碌同得美好的果效，一同成长。"
      meta={[{ label: "聚会时间", value: "详见公告" }]}
    />
  );
}
