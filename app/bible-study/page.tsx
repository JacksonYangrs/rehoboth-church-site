import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import BibleStudyList from "../components/BibleStudyList";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "查經公告 · 利河伯教會" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-hero site-hero--column" style={{ backgroundImage: "url(/bible-study-film.png)" }}>
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">BIBLE STUDY · 查經公告</p>
          <h1>查經公告</h1>
          <VerseQuote verse={VERSE_COLUMNS["bible-study"]} />
          <p className="site-hero-copy">每週五晚 Zoom 同步查經。每週公告在此發布：主題、查考經文、連結與帶領同工。</p>
        </div>
      </header>

      <section className="site-page-body">
        <h2>每週查經</h2>
        <BibleStudyList />
      </section>
    </main>
  );
}
