import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import MembershipForm from "../components/MembershipForm";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "认识教会 · 利河伯教会" };

export default function Page() {
  return (
    <main className="site-page">
      <header className="site-hero site-hero--column" style={{ backgroundImage: "url(/bible-study-hero.png)" }}>
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">ABOUT · 认识教会</p>
          <h1>认识教会</h1>
          <VerseQuote verse={VERSE_COLUMNS.about} />
          <p className="site-hero-copy">彼此相爱，是我们被认出的记号。欢迎你走进利河伯。</p>
        </div>
      </header>

      <section className="site-page-body site-about">
        <div className="site-about-copy">
          <h2>利河伯教会</h2>
          <p>
            利河伯（Rehoboth）意即「寬闊之地」。如同以撒在别是巴挖出活水井，
            我们相信神为教会预备了宽阔之处——让我们在这里敬拜、在这里同行、
            在这里见证神的信实。
          </p>
          <p>主日敬拜・每周日 ｜ 查经・每周五 Zoom 同步 ｜ 周间探访・同工安排</p>
          <p>欢迎你来看看，愿你在这里得著安息。</p>
        </div>

        <div className="site-membership">
          <div className="site-membership-head">
            <p className="eyebrow">加入我们 · MEMBERSHIP</p>
            <h2>会员发展与接纳</h2>
            <p>
              如果你还不确定信仰、还在观望，或想进一步认识教会、加入我们——
              都欢迎留下意愿。不便当面说也没关系，可以在这里线上表达，
              教会同工会温柔地与你联系。
            </p>
            <ul className="site-membership-list">
              <li><span>✝</span>想了解信仰、认识这位创造主</li>
              <li><span>✝</span>想参加聚会，先来听听看看</li>
              <li><span>✝</span>想加入教会，与弟兄姊妹同行</li>
              <li><span>✝</span>只是想先认识教会的朋友</li>
            </ul>
          </div>
          <MembershipForm />
        </div>
      </section>
    </main>
  );
}
