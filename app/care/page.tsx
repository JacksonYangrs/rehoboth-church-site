import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "愛心窗口 · 利河伯教會" };

export default function Page() {
  return (
    <PlaceholderPage
      eyebrow="CARE · 愛心窗口"
      title="愛心窗口"
      verse={VERSE_COLUMNS.care}
      description="為不方便面對面表達的人提供線上、可匿名的聯繫渠道：家庭、關係、子女教育、信仰疑問與情緒壓力。正在籌備中。"
    />
  );
}
