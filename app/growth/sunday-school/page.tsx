import type { Metadata } from "next";
import GrowthColumnPage from "../../components/GrowthColumnPage";
import { GROWTH_SUBCOLUMNS } from "../../verses";

export const metadata: Metadata = { title: "儿童主日学 · 利河伯教会" };

const item = GROWTH_SUBCOLUMNS.find((i) => i.slug === "sunday-school")!;

export default function Page() {
  return (
    <GrowthColumnPage
      column="sunday-school"
      title="儿童主日学"
      verse={item.verse}
      intro="为 12 岁以下孩子预备的主日学：圣经故事、诗歌与品格教导，让孩子从小走在当行的道上。"
      meta={[
        { label: "对象", value: "12 岁以下儿童" },
        { label: "聚会时间", value: "主日敬拜时段（详见公告）" },
      ]}
    />
  );
}
