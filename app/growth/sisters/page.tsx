import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "姊妹团契 · 利河伯教会" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "sisters")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="sisters"
      title="姊妹团契"
      verse={item.verse}
      intro="姊妹们彼此切实相爱、互相扶持的团契：查经、祷告与生命分享，爱能遮掩许多的罪。"
      meta={[{ label: "聚会时间", value: "详见公告" }]}
    />
  );
}
