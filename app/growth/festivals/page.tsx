import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "節日與特別活動 · 利河伯教會" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "festivals")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="festivals"
      title="節日與特別活動"
      verse={item.verse}
      intro="聖誕、受難節、復活節與各樣特別聚會的記錄：耶和華果然為我們行了大事，我們就歡喜。"
      meta={[{ label: "近期活動", value: "詳見公告" }]}
    />
  );
}
