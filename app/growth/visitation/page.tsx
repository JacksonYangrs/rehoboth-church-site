import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "教會探訪 · 利河伯教會" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "visitation")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="visitation"
      title="教會探訪"
      verse={item.verse}
      intro="週間探訪記錄：同工到姊妹家、慕道友家中關懷問候，在最小的弟兄身上服事主。"
      meta={[{ label: "探訪安排", value: "每週由同工安排，詳見公告" }]}
    />
  );
}
