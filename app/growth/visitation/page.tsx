import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "教会探访 · 利河伯教会" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "visitation")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="visitation"
      title="教会探访"
      verse={item.verse}
      intro="周间探访记录：同工到姊妹家、慕道友家中关怀问候，在最小的弟兄身上服事主。"
      meta={[{ label: "探访安排", value: "每周由同工安排，详见公告" }]}
    />
  );
}
