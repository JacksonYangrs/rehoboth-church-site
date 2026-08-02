import type { Metadata } from "next";
import { VERSE_COLUMNS, GROWTH_SUBCOLUMNS, BUILDING_TOPICS, type Verse } from "./verses";
import SubCard from "./components/SubCard";
import BibleStudyList from "./components/BibleStudyList";
import CareForm from "./components/CareForm";

export const metadata: Metadata = {
  title: "利河伯教会",
  description: "在这里敬拜，在这里同行，在这里见证神的信实。",
};

// 银行账户信息（首页直接展示，编辑此处同步二级页 /giving/）
const ACCOUNT = {
  name: "REHOBOTH CHURCH INC.",
  bank: "UNION BANK",
  number: "001900004401",
  swift: "",
  currency: "",
};

// 一级栏目：图片型宽幅区块（照片 + 深色叠层 + 经文寄语）
function PhotoBlock({
  eyebrow,
  title,
  verse,
  desc,
  photo,
  actionHref,
  actionLabel,
  align = "left",
}: {
  eyebrow: string;
  title: string;
  verse?: Verse;
  desc: string;
  photo: string;
  actionHref?: string;
  actionLabel?: string;
  align?: "left" | "center";
}) {
  return (
    <section className="site-block site-block--photo" style={{ backgroundImage: `url(${photo})` }}>
      <div className="site-block-overlay" />
      <div className={`site-block-inner site-block-inner--${align}`}>
        <p className="eyebrow-light">{eyebrow}</p>
        <h2>{title}</h2>
        {verse ? <blockquote className="site-verse"><p className="site-verse-text">「{verse.text}」</p><footer>——{verse.ref}</footer></blockquote> : null}
        <p className="site-block-copy">{desc}</p>
        {actionHref ? (
          <div className="site-block-actions">
            <a className="site-btn-primary" href={actionHref}>{actionLabel}</a>
          </div>
        ) : null}
      </div>
    </section>
  );
}

// 一级栏目：深色区块（无照片，子栏目网格）
function DarkBlock({
  eyebrow,
  title,
  verse,
  desc,
  children,
}: {
  eyebrow: string;
  title: string;
  verse?: Verse;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="site-block site-block--dark">
      <div className="site-block-inner site-block-inner--full">
        <div className="site-block-head">
          <p className="eyebrow-light">{eyebrow}</p>
          <h2>{title}</h2>
          {verse ? <blockquote className="site-verse"><p className="site-verse-text">「{verse.text}」</p><footer>——{verse.ref}</footer></blockquote> : null}
          <p className="site-block-copy">{desc}</p>
        </div>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const accountRows: { label: string; value: string; accent?: boolean }[] = [
    { label: "账户名稱", value: ACCOUNT.name || "待教會確認" },
    { label: "開戶銀行", value: ACCOUNT.bank || "待教會確認" },
    { label: "銀行賬號", value: ACCOUNT.number || "待教會確認", accent: true },
    { label: "SWIFT / BIC", value: ACCOUNT.swift || "待教會確認" },
    { label: "幣種", value: ACCOUNT.currency || "待教會確認" },
  ];

  return (
    <main className="site-home">
      {/* 1. Hero */}
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

      {/* 2. 每日灵修 · 特别栏目 */}
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

      {/* 3. 线上敬拜 */}
      <PhotoBlock
        eyebrow="WORSHIP · 线上敬拜"
        title="线上敬拜"
        verse={VERSE_COLUMNS.worship}
        desc="主日敬拜、讲道主题、诗歌敬拜与特别聚会的影音与讲义。线上与线下，一同屈身敬拜造我们的主。"
        photo="/worship-documentary.png"
      />

      {/* 4. 教会成长 */}
      <section className="site-block site-block--paper">
        <div className="site-block-inner site-block-inner--full">
          <div className="site-block-head">
            <p className="eyebrow">GROWTH · 教会成长</p>
            <h2>教会成长</h2>
            {VERSE_COLUMNS.growth ? (
              <blockquote className="site-verse site-verse--paper">
                <p className="site-verse-text">「{VERSE_COLUMNS.growth.text}」</p>
                <footer>——{VERSE_COLUMNS.growth.ref}</footer>
              </blockquote>
            ) : null}
            <p className="site-block-copy">儿童主日学、青少年与弟兄姊妹团契、教会探访与节日活动，在爱中彼此建立。</p>
          </div>
          <div className="site-subgrid">
            {GROWTH_SUBCOLUMNS.map((item) => (
              <SubCard key={item.slug} label={item.label} verse={item.verse} tone={item.tone} icon={item.icon} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. 查经公告（首页直接展示公告列表） */}
      <section className="site-block site-block--paper">
        <div className="site-block-inner site-block-inner--full">
          <div className="site-block-head">
            <p className="eyebrow">BIBLE STUDY · 查經公告</p>
            <h2>查經公告</h2>
            <blockquote className="site-verse site-verse--paper">
              <p className="site-verse-text">「{VERSE_COLUMNS["bible-study"].text}」</p>
              <footer>——{VERSE_COLUMNS["bible-study"].ref}</footer>
            </blockquote>
            <p className="site-block-copy">每週五查經，主題、查考經文、主持人、時間與地點在此公布。</p>
          </div>
          <BibleStudyList />
        </div>
      </section>

      {/* 6. 建堂专题 */}
      <DarkBlock
        eyebrow="BUILDING · 建堂专题"
        title="建堂专题"
        verse={VERSE_COLUMNS.building}
        desc="建堂异象、历程、工程进度、祷告与见证——若不是耶和华建造房屋，建造的人就枉然劳力。"
      >
        <div className="site-subgrid site-subgrid--on-dark">
          {BUILDING_TOPICS.map((topic) => (
            <SubCard key={topic.slug} label={topic.label} verse={topic.verse} tone={topic.tone} icon={topic.icon} />
          ))}
        </div>
      </DarkBlock>

      {/* 7. 奉献（首页直接展示银行账户卡） */}
      <section className="site-block site-block--gold">
        <div className="site-block-inner site-block-inner--center">
          <p className="eyebrow">GIVING · 奉獻</p>
          <h2>線上奉獻</h2>
          <blockquote className="site-verse site-verse--paper">
            <p className="site-verse-text">「{VERSE_COLUMNS.giving.text}」</p>
            <footer>——{VERSE_COLUMNS.giving.ref}</footer>
          </blockquote>
          <p className="site-block-copy">日常奉獻、建堂奉獻與特別事工奉獻，支持教會各項服侍。匯款時請註明用途。</p>
          <div className="site-giving" style={{ marginTop: 12, maxWidth: 560 }}>
            <dl className="site-givcard">
              {accountRows.map((row) => (
                <div className={`site-givcard-row${row.accent ? " site-givcard-row--accent" : ""}`} key={row.label}>
                  <dt>{row.label}</dt>
                  <dd>{row.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* 8. 爱心窗口（首页直接展示倾诉输入框） */}
      <section className="site-block site-block--paper">
        <div className="site-block-inner site-block-inner--full">
          <div className="site-block-head">
            <p className="eyebrow">CARE · 愛心窗口</p>
            <h2>愛心窗口</h2>
            <blockquote className="site-verse site-verse--paper">
              <p className="site-verse-text">「{VERSE_COLUMNS.care.text}」</p>
              <footer>——{VERSE_COLUMNS.care.ref}</footer>
            </blockquote>
            <p className="site-block-copy">有些話不方便當面說、不方便線上說，就在這裡寫下來。教會同工會以溫柔、保密的心聆聽，並可為你遠程輔導。</p>
          </div>
          <div className="site-care-grid">
            <div className="site-care-copy">
              <h3>可以說些什麼？</h3>
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
          </div>
        </div>
      </section>

      {/* 9. 认识教会 */}
      <section className="site-block site-block--dark">
        <div className="site-block-inner site-block-inner--center">
          <img className="site-block-logo" src="/church-logo.jpeg" alt="利河伯教会" />
          <p className="eyebrow-light">ABOUT · 认识教会</p>
          <h2>认识教会</h2>
          <blockquote className="site-verse">
            <p className="site-verse-text">「{VERSE_COLUMNS.about.text}」</p>
            <footer>——{VERSE_COLUMNS.about.ref}</footer>
          </blockquote>
          <p className="site-block-copy">教会简介、异象与使命、信仰立场、聚会时间与地点，欢迎你走进利河伯。</p>
          <div className="site-block-actions">
            <a className="site-btn-primary" href="/about/">认识我们</a>
          </div>
        </div>
      </section>

      {/* 10. 聚会时间与联系 */}
      <section className="site-section site-contact">
        <h2 className="site-section-title">聚会时间与联系</h2>
        <p>主日敬拜 · 每周日 ｜ 查经 · 每周 Zoom 同步</p>
        <p>欢迎你走进利河伯，在宽阔之地得着安息。</p>
      </section>
    </main>
  );
}