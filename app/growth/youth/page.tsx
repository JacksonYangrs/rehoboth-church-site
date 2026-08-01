import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "青少年團契 · 利河伯教會" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "youth")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="youth"
      title="青少年團契"
      verse={item.verse}
      intro="為 13–18 歲青少年預備的團契：信仰探索、同伴同行與屬靈成長，不可叫人小看你年輕。"
      meta={[
        { label: "對象", value: "13–18 歲青少年" },
        { label: "聚會時間", value: "詳見公告" },
      ]}
    />
  );
}
