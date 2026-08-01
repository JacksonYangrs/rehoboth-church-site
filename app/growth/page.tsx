import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";

export const metadata: Metadata = { title: "教会成长 · 利河伯教会" };

export default function Page() {
  return (
    <PlaceholderPage
      title="教会成长"
      description="儿童主日学、青少年与弟兄姊妹团契、教会探访与节日活动的照片、回顾与见证，正在筹备中。"
    />
  );
}
