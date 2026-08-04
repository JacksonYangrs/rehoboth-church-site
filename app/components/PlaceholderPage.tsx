import type { Verse } from "../verses";
import VerseQuote from "./VerseQuote";

// 「筹备中」占位页，供设计文档中尚未展开内容的栏目复用。
// verse 可选：传入后显示在标题下方（经文寄语）。
export default function PlaceholderPage({
  title,
  eyebrow,
  description,
  verse,
}: {
  title: string;
  eyebrow?: string;
  description: string;
  verse?: Verse;
}) {
  return (
    <main className="site-page">
      <header className="site-page-head">
        <p className="eyebrow-light">{eyebrow ?? "REHOBOTH CHURCH · 利河伯教会"}</p>
        <h1>{title}</h1>
        {verse ? <VerseQuote verse={verse} /> : null}
        <p>{description}</p>
      </header>
      <section className="site-page-body site-placeholder" style={{ minHeight: 0, padding: "0 0 60px" }}>
        <div className="site-placeholder-inner">
          <p className="eyebrow-light">筹备中 · COMING SOON</p>
          <p style={{ marginTop: 14 }}>本栏目内容正在筹备中，欢迎先逛逛其他栏目。</p>
          <div className="site-placeholder-actions">
            <a className="site-btn-primary" href="/">返回首页</a>
            <a className="site-btn-ghost" href="/devotion/">进入每日灵修</a>
          </div>
        </div>
      </section>
    </main>
  );
}
