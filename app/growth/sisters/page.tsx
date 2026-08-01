import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "姊妹團契 · 利河伯教會" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "sisters")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="sisters"
      title="姊妹團契"
      verse={item.verse}
      intro="姊妹們彼此切實相愛、互相扶持的團契：查經、禱告與生命分享，愛能遮掩許多的罪。"
      meta={[{ label: "聚會時間", value: "詳見公告" }]}
    />
  );
}
