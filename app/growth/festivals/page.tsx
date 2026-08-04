import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "节日与特别活动 · 利河伯教会" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "festivals")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="festivals"
      title="节日与特别活动"
      verse={item.verse}
      intro="圣诞、受难节、复活节与各样特别聚会的记录：耶和华果然为我们行了大事，我们就欢喜。"
      meta={[{ label: "近期活动", value: "详见公告" }]}
    />
  );
}
