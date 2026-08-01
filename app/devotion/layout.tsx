import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "每日与主同行 · 利河伯教会",
  description: "今天自动定位的灵修阅读、共读分享与代祷同行。",
};

export default function DevotionLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav className="site-breadcrumb" aria-label="面包屑">
        <a href="/">首页</a>
        <span aria-hidden="true">／</span>
        <b>每日灵修</b>
      </nav>
      {children}
    </>
  );
}
