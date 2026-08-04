import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import BibleStudyList from "../components/BibleStudyList";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "查经公告 · 利河伯教会" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-hero site-hero--column" style={{ backgroundImage: "url(/bible-study-film.png)" }}>
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">BIBLE STUDY · 查经公告</p>
          <h1>查经公告</h1>
          <VerseQuote verse={VERSE_COLUMNS["bible-study"]} />
          <p className="site-hero-copy">每周五晚 Zoom 同步查经。每周公告在此发布：主题、查考经文、连结与带领同工。</p>
        </div>
      </header>

      <section className="site-page-body">
        <h2>每周查经</h2>
        <BibleStudyList />
      </section>
    </main>
  );
}
