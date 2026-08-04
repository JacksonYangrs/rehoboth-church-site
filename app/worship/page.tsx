import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "线上敬拜 · 利河伯教会" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-hero site-hero--column" style={{ backgroundImage: "url(/worship-documentary.png)" }}>
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">WORSHIP · 线上敬拜</p>
          <h1>线上敬拜</h1>
          <VerseQuote verse={VERSE_COLUMNS.worship} />
          <p className="site-hero-copy">主日敬拜、讲道主题、诗歌敬拜与特别聚会的影音与讲义，正在筹备中。愿我们线上也能一同敬拜。</p>
        </div>
      </header>
      <section className="site-page-body site-placeholder" style={{ minHeight: 0, padding: "0 0 60px" }}>
        <div className="site-placeholder-inner">
          <p className="eyebrow-light">筹备中 · COMING SOON</p>
          <p style={{ marginTop: 14 }}>主日讲道影音、敬拜诗歌与聚会回放将在此公布，请时常回来。</p>
          <div className="site-placeholder-actions">
            <a className="site-btn-primary" href="/">返回首页</a>
            <a className="site-btn-ghost" href="/devotion/">进入每日灵修</a>
          </div>
        </div>
      </section>
    </main>
  );
}
