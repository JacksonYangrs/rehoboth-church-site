import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "線上敬拜 · 利河伯教會" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-hero site-hero--column" style={{ backgroundImage: "url(/worship-documentary.png)" }}>
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">WORSHIP · 線上敬拜</p>
          <h1>線上敬拜</h1>
          <VerseQuote verse={VERSE_COLUMNS.worship} />
          <p className="site-hero-copy">主日敬拜、講道主題、詩歌敬拜與特別聚會的影音與講義，正在籌備中。願我們線上也能一同敬拜。</p>
        </div>
      </header>
      <section className="site-page-body site-placeholder" style={{ minHeight: 0, padding: "0 0 60px" }}>
        <div className="site-placeholder-inner">
          <p className="eyebrow-light">籌備中 · COMING SOON</p>
          <p style={{ marginTop: 14 }}>主日講道影音、敬拜詩歌與聚會回放將在此公布，請時常回來。</p>
          <div className="site-placeholder-actions">
            <a className="site-btn-primary" href="/">返回首頁</a>
            <a className="site-btn-ghost" href="/devotion/">進入每日靈修</a>
          </div>
        </div>
      </section>
    </main>
  );
}
