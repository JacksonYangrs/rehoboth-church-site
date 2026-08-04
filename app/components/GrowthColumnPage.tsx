import type { Metadata } from "next";
import type { Verse } from "../verses";
import VerseQuote from "./VerseQuote";
import ColumnFeed from "./ColumnFeed";

// 教会成长专栏页通用骨架：hero（经文寄语）+ 介绍 + 活动记录流 + 聚会信息
export default function GrowthColumnPage({
  column,
  title,
  verse,
  intro,
  meta,
}: {
  column: string; // API columnSlug
  title: string;
  verse: Verse;
  intro: string;
  meta?: { label: string; value: string }[];
}) {
  return (
    <main className="site-page">
      <header className="site-hero site-hero--column" style={{ backgroundImage: "url(/bible-study-hero.png)" }}>
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">GROWTH · {title}</p>
          <h1>{title}</h1>
          <VerseQuote verse={verse} />
          <p className="site-hero-copy">{intro}</p>
        </div>
      </header>

      <section className="site-page-body">
        <h2>活动回顾</h2>
        <ColumnFeed columnSlug={column} emptyText="暂无活动记录，敬请期待。" />

        {meta && meta.length > 0 ? (
          <dl className="site-meta-card">
            {meta.map((m) => (
              <div key={m.label}>
                <dt>{m.label}</dt>
                <dd>{m.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </section>
    </main>
  );
}
