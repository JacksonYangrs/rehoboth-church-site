import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import CareForm from "../components/CareForm";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "愛心窗口 · 利河伯教會" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-hero site-hero--column" style={{ backgroundImage: "url(/bible-study-hero.png)" }}>
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">CARE · 愛心窗口</p>
          <h1>愛心窗口</h1>
          <VerseQuote verse={VERSE_COLUMNS.care} />
          <p className="site-hero-copy">有些話不方便當面說、不方便線上說，就寫在這裡。教會同工會以溫柔、保密的心聆聽，並可為你遠程輔導。</p>
        </div>
      </header>

      <section className="site-page-body site-care-grid">
        <div className="site-care-copy">
          <h2>可以說些什麼？</h2>
          <ul className="site-care-list">
            <li>人際關係、家庭、子女教育上的困惑</li>
            <li>信仰上的疑問與掙扎</li>
            <li>情緒壓力，需要有人聆聽與代禱</li>
            <li>任何想讓教會知道、卻不便公開的事</li>
          </ul>
          <p className="site-care-promise">
            你的傾訴<b>只會被教會同工看見</b>，不會公開。留下聯繫方式，同工可以為你遠程輔導；不留下也沒有關係，我們依然為你禱告。
          </p>
        </div>
        <div className="site-care-form">
          <CareForm />
        </div>
      </section>
    </main>
  );
}
