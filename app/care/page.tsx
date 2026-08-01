import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";

export const metadata: Metadata = { title: "爱心窗口 · 利河伯教会" };

export default function Page() {
  return (
    <PlaceholderPage
      title="爱心窗口"
      description="为不方便面对面表达的人提供线上、可匿名的联系渠道：家庭、关系、子女教育、信仰疑问与情绪压力。正在筹备中。"
    />
  );
}
