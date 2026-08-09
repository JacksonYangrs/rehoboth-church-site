import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import SubCard from "../components/SubCard";
import { VERSE_COLUMNS, BUILDING_TOPICS } from "../verses";

export const metadata: Metadata = { title: "建堂专题 · 利河伯教会" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-page-head">
        <p className="eyebrow-light">BUILDING · 建堂专题</p>
        <h1>建堂专题</h1>
        <VerseQuote verse={VERSE_COLUMNS.building} />
        <p>若不是耶和华建造房屋，建造的人就枉然劳力。与我们一同记念建堂的每一步。</p>
      </header>

      <section className="site-page-body">
        <h2>建堂主题</h2>
        <div className="site-subgrid">
          {BUILDING_TOPICS.map((topic) => (
            <SubCard key={topic.slug} label={topic.label} verse={topic.verse} image={topic.image} alt={topic.label} />
          ))}
        </div>
        <p className="site-contact" style={{ marginTop: 40 }}>
          建堂异象、历程、工程进度与见证将陆续在此展开，邀请你以祷告与奉献一同参与。
        </p>
      </section>
    </main>
  );
}
