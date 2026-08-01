import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import SubCard from "../components/SubCard";
import { VERSE_COLUMNS, GROWTH_SUBCOLUMNS } from "../verses";

export const metadata: Metadata = { title: "教會成長 · 利河伯教會" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-page-head">
        <p className="eyebrow-light">GROWTH · 教會成長</p>
        <h1>教會成長</h1>
        <VerseQuote verse={VERSE_COLUMNS.growth} />
        <p>兒童主日學、青少年與弟兄姊妹團契、教會探訪與節日活動，在愛中彼此建立。</p>
      </header>

      <section className="site-page-body">
        <h2>事工與團契</h2>
        <div className="site-subgrid">
          {GROWTH_SUBCOLUMNS.map((item) => (
            <SubCard key={item.slug} label={item.label} verse={item.verse} tone={item.tone} icon={item.icon} />
          ))}
        </div>
        <p className="site-contact" style={{ marginTop: 40 }}>
          各團契聚會時間與地點將陸續在此公布，歡迎隨時加入。
        </p>
      </section>
    </main>
  );
}
