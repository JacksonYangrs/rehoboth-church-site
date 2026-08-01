import type { Metadata } from "next";
import { HOME_COLUMNS } from "./nav";
import { VERSE_COLUMNS } from "./verses";

export const metadata: Metadata = {
  title: "利河伯教会",
  description: "在这里敬拜，在这里同行，在这里见证神的信实。",
};

export default function Home() {
  return (
    <main className="site-home">
      <section className="site-hero" style={{ backgroundImage: "url(/church-hero.jpg)" }}>
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">REHOBOTH CHURCH · 利河伯教会</p>
          <div className="site-hero-actions">
            <a className="site-btn-primary" href="/devotion/">进入每日灵修</a>
            <a className="site-btn-ghost" href="/about/">认识我们</a>
          </div>
        </div>
      </section>

      <section className="site-section">
        <h2 className="site-section-title">每日灵修 · 特别栏目</h2>
        <article className="site-cta">
          <div>
            <p className="eyebrow-light">WALK WITH THE LORD</p>
            <h3>每日与主同行</h3>
            <p>今天自动定位的灵修阅读、共读分享与代祷同行。无需登录，进度保存在本机。</p>
          </div>
          <a className="site-btn-primary" href="/devotion/">开始今天的同行</a>
        </article>
      </section>

      <section className="site-section">
        <h2 className="site-section-title">教会栏目</h2>
        <div className="site-grid">
          {HOME_COLUMNS.map((col) => {
            const verse = VERSE_COLUMNS[col.verseKey];
            return (
              <a className="site-card" key={col.href} href={col.href}>
                <span className="site-card-icon" aria-hidden="true">{col.icon}</span>
                <b>{col.label}</b>
                {verse ? (
                  <small className="site-card-verse">「{verse.text}」<i>——{verse.ref}</i></small>
                ) : null}
                <small className="site-card-desc">{col.desc}</small>
              </a>
            );
          })}
        </div>
      </section>

      <section className="site-section site-contact">
        <h2 className="site-section-title">聚会时间与联系</h2>
        <p>主日敬拜 · 每周日 ｜ 查经 · 每周 Zoom 同步</p>
        <p>欢迎你走进利河伯，在宽阔之地得着安息。</p>
      </section>
    </main>
  );
}
