import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";

export const metadata: Metadata = { title: "奉献 · 利河伯教会" };

export default function Page() {
  return (
    <PlaceholderPage
      title="奉献"
      description="日常奉献、建堂奉献与特别事工奉献的账户信息，正在筹备中。正式上线前需由教会确认银行账户资料。捐得乐意的人，是神所喜爱的。"
    />
  );
}
