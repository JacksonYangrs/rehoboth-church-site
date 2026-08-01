import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import { VERSE_COLUMNS, BUILDING_TOPICS } from "../verses";

export const metadata: Metadata = { title: "建堂專題 · 利河伯教會" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-page-head">
        <p className="eyebrow-light">BUILDING · 建堂專題</p>
        <h1>建堂專題</h1>
        <VerseQuote verse={VERSE_COLUMNS.building} />
        <p>若不是耶和華建造房屋，建造的人就枉然勞力。與我們一同記念建堂的每一步。</p>
      </header>

      <section className="site-page-body">
        <h2>建堂主題</h2>
        <div className="site-subgrid">
          {BUILDING_TOPICS.map((topic) => (
            <article className="site-subcard" key={topic.slug}>
              <b>{topic.label}</b>
              <VerseQuote verse={topic.verse} tone="paper" />
            </article>
          ))}
        </div>
        <p className="site-contact" style={{ marginTop: 40 }}>
          建堂異象、歷程、工程進度與見證將陸續在此展開，邀請你以禱告與奉獻一同參與。
        </p>
      </section>
    </main>
  );
}
