import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import SubCard from "../components/SubCard";
import { VERSE_COLUMNS, GROWTH_SUBCOLUMNS } from "../verses";

export const metadata: Metadata = { title: "教会成长 · 利河伯教会" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-page-head">
        <p className="eyebrow-light">GROWTH · 教会成长</p>
        <h1>教会成长</h1>
        <VerseQuote verse={VERSE_COLUMNS.growth} />
        <p>儿童主日学、青少年与弟兄姊妹团契、教会探访与节日活动，在爱中彼此建立。</p>
      </header>

      <section className="site-page-body">
        <h2>事工与团契</h2>
        <div className="site-subgrid">
          {GROWTH_SUBCOLUMNS.map((item) => (
            <SubCard key={item.slug} label={item.label} verse={item.verse} image={item.image} alt={item.label} />
          ))}
        </div>
        <p className="site-contact" style={{ marginTop: 40 }}>
          各团契聚会时间与地点将陆续在此公布，欢迎随时加入。
        </p>
      </section>
    </main>
  );
}
