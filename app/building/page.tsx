import type { Metadata } from "next";
import PlaceholderPage from "../components/PlaceholderPage";

export const metadata: Metadata = { title: "建堂专题 · 利河伯教会" };

export default function Page() {
  return (
    <PlaceholderPage
      title="建堂专题"
      description="建堂异象、历程、祷告记念、设计与工程进度，以及建堂照片与见证，正在筹备中。若不是耶和华建造房屋，建造的人就枉然劳力。"
    />
  );
}
