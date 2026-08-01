import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";

export const metadata: Metadata = { title: "认识教会 · 利河伯教会" };

export default function Page() {
  return (
    <PlaceholderPage
      title="认识教会"
      description="教会简介、异象与使命、信仰立场、牧者与同工、聚会时间与地点、新朋友指南，正在筹备中。欢迎你走进利河伯。"
    />
  );
}
