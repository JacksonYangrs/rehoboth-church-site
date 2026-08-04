import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "青少年团契 · 利河伯教会" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "youth")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="youth"
      title="青少年团契"
      verse={item.verse}
      intro="为 13–18 岁青少年预备的团契：信仰探索、同伴同行与属灵成长，不可叫人小看你年轻。"
      meta={[
        { label: "对象", value: "13–18 岁青少年" },
        { label: "聚会时间", value: "详见公告" },
      ]}
    />
  );
}
