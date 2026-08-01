import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import MembershipForm from "../components/MembershipForm";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "認識教會 · 利河伯教會" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-hero site-hero--column" style={{ backgroundImage: "url(/bible-study-hero.png)" }}>
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">ABOUT · 認識教會</p>
          <h1>認識教會</h1>
          <VerseQuote verse={VERSE_COLUMNS.about} />
          <p className="site-hero-copy">彼此相愛，是我們被認出的記號。歡迎你走進利河伯。</p>
        </div>
      </header>

      <section className="site-page-body site-about">
        <div className="site-about-copy">
          <h2>利河伯教會</h2>
          <p>
            利河伯（Rehoboth）意即「寬闊之地」。如同以撒在別是巴挖出活水井，
            我們相信神為教會預備了寬闊之處——讓我們在這裡敬拜、在這裡同行、
            在這裡見證神的信實。
          </p>
          <p>主日敬拜・每週日 ｜ 查經・每週五 Zoom 同步 ｜ 週間探訪・同工安排</p>
          <p>歡迎你來看看，願你在這裡得著安息。</p>
        </div>

        <div className="site-membership">
          <div className="site-membership-head">
            <p className="eyebrow">加入我們 · MEMBERSHIP</p>
            <h2>會員發展與接納</h2>
            <p>
              如果你還不確定信仰、還在觀望，或想進一步認識教會、加入我們——
              都歡迎留下意願。不便當面說也沒關係，可以在這裡線上表達，
              教會同工會溫柔地與你聯繫。
            </p>
          </div>
          <MembershipForm />
        </div>
      </section>
    </main>
  );
}
