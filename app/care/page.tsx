import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import CareForm from "../components/CareForm";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "爱心窗口 · 利河伯教会" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-hero site-hero--column">
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">CARE · 爱心窗口</p>
          <h1>爱心窗口</h1>
          <VerseQuote verse={VERSE_COLUMNS.care} />
          <p className="site-hero-copy">有些话不方便当面说、不方便线上说，就写在这里。教会同工会以温柔、保密的心聆听，并可为你远程辅导。</p>
        </div>
      </header>

      <section className="site-page-body site-care-grid">
        <div className="site-care-copy">
          <h2>可以说些什么？</h2>
          <ul className="site-care-list">
            <li>人际关系、家庭、子女教育上的困惑</li>
            <li>信仰上的疑问与挣扎</li>
            <li>情绪压力，需要有人聆听与代祷</li>
            <li>任何想让教会知道、却不便公开的事</li>
          </ul>
          <p className="site-care-promise">
            你的倾诉<b>只会被教会同工看见</b>，不会公开。留下联系方式，同工可以为你远程辅导；不留下也没有关系，我们依然为你祷告。
          </p>
        </div>
        <div className="site-care-form">
          <CareForm />
        </div>
      </section>
    </main>
  );
}
