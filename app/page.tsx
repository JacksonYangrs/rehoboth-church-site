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

// 一级栏目：照片宽幅（深色叠层 + 经文寄语 + 简介 + 入口）
function PhotoBlock({
  title,
  verse,
  desc,
  photo,
  actionHref,
  actionLabel,
}: {
  title: string;
  verse?: Verse;
  desc: string;
  photo: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <section className="site-block site-block--photo" style={{ backgroundImage: `url(${photo})` }}>
      <div className="site-block-overlay" />
      <div className="site-block-inner">
        <h2>{title}</h2>
        {verse ? (
          <blockquote className="site-verse">
            <p className="site-verse-text">「{verse.text}」</p>
            <footer>——{verse.ref}</footer>
          </blockquote>
        ) : null}
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

// 一级栏目：纸面块（标题 + 经文寄语 + 简介 + 内容区）
function PaperBlock({
  title,
  verse,
  desc,
  children,
}: {
  title: string;
  verse?: Verse;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="site-block site-block--paper">
      <div className="site-block-inner site-block-inner--full">
        <header className="site-block-head">
          <h2>{title}</h2>
          {verse ? (
            <blockquote className="site-verse site-verse--paper">
              <p className="site-verse-text">「{verse.text}」</p>
              <footer>——{verse.ref}</footer>
            </blockquote>
          ) : null}
          {desc ? <p className="site-block-copy">{desc}</p> : null}
        </header>
        {children}
      </div>
    </section>
  );
}

// 一级栏目：深蓝块（标题 + 经文寄语 + 简介 + 入口）
function DarkBlock({
  title,
  verse,
  desc,
  actionHref,
  actionLabel,
  children,
}: {
  title: string;
  verse?: Verse;
  desc: string;
  actionHref?: string;
  actionLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="site-block site-block--dark">
      <div className="site-block-inner site-block-inner--full">
        <header className="site-block-head">
          <h2>{title}</h2>
          {verse ? (
            <blockquote className="site-verse">
              <p className="site-verse-text">「{verse.text}」</p>
              <footer>——{verse.ref}</footer>
            </blockquote>
          ) : null}
          <p className="site-block-copy">{desc}</p>
          {actionHref ? (
            <div className="site-block-actions">
              <a className="site-btn-primary" href={actionHref}>{actionLabel}</a>
            </div>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}

export default function Home() {
  const accountRows: { label: string; value: string; accent?: boolean }[] = [
    { label: "账户名称", value: ACCOUNT.name || "待教会确认" },
    { label: "开户银行", value: ACCOUNT.bank || "待教会确认" },
    { label: "银行账号", value: ACCOUNT.number || "待教会确认", accent: true },
    { label: "SWIFT / BIC", value: ACCOUNT.swift || "待教会确认" },
    { label: "币种", value: ACCOUNT.currency || "待教会确认" },
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
        <article className="site-cta">
          <div>
            <h3>每日与主同行</h3>
            <p>今天自动定位的灵修阅读、共读分享与代祷同行。无需登录，进度保存在本机。</p>
          </div>
          <a className="site-btn-primary" href="/devotion/">开始今天的同行</a>
        </article>
      </section>

      {/* 3. 线上敬拜（照片块） */}
      <PhotoBlock
        title="线上敬拜"
        verse={VERSE_COLUMNS.worship}
        desc="主日敬拜、讲道主题、诗歌敬拜与特别聚会的影音与讲义。线上与线下，一同屈身敬拜造我们的主。"
        photo="/worship-documentary.png"
      />

      {/* 4. 教会成长 */}
      <PaperBlock
        title="教会成长"
        verse={VERSE_COLUMNS.growth}
        desc="儿童主日学、青少年与弟兄姊妹团契、教会探访与节日活动，在爱中彼此建立。"
      >
        <div className="site-subgrid">
          {GROWTH_SUBCOLUMNS.map((item) => (
            <SubCard key={item.slug} label={item.label} verse={item.verse} image={item.image} alt={item.label} />
          ))}
        </div>
      </PaperBlock>

      {/* 5. 查经公告 */}
      <PaperBlock
        title="查经公告"
        verse={VERSE_COLUMNS["bible-study"]}
        desc="每周五查经，主题、查考经文、主持人、时间与地点在此公布。"
      >
        <BibleStudyList />
      </PaperBlock>

      {/* 6. 建堂专题（深蓝块） */}
      <DarkBlock
        title="建堂专题"
        verse={VERSE_COLUMNS.building}
        desc="建堂异象、历程、工程进度、祷告与见证——若不是耶和华建造房屋，建造的人就枉然劳力。"
      >
        <div className="site-subgrid">
          {BUILDING_TOPICS.map((topic) => (
            <SubCard key={topic.slug} label={topic.label} verse={topic.verse} image={topic.image} alt={topic.label} />
          ))}
        </div>
      </DarkBlock>

      {/* 7. 奉献（金色块） */}
      <section className="site-block site-block--gold">
        <div className="site-block-inner site-block-inner--center">
          <header className="site-block-head">
            <h2>线上奉献</h2>
            <blockquote className="site-verse site-verse--paper">
              <p className="site-verse-text">「{VERSE_COLUMNS.giving.text}」</p>
              <footer>——{VERSE_COLUMNS.giving.ref}</footer>
            </blockquote>
            <p className="site-block-copy">日常奉献、建堂奉献与特别事工奉献，支持教会各项服侍。汇款时请注明用途。</p>
          </header>
          <div className="site-giving" style={{ marginTop: 8, maxWidth: 560 }}>
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

      {/* 8. 爱心窗口 */}
      <PaperBlock
        title="爱心窗口"
        verse={VERSE_COLUMNS.care}
        desc="有些话不方便当面说、不方便线上说，就在这里写下来。教会同工会以温柔、保密的心聆听，并可为你远程辅导。"
      >
        <div className="site-care-grid">
          <div className="site-care-copy">
            <h3>可以说些什么？</h3>
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
        </div>
      </PaperBlock>

      {/* 9. 认识教会（含聚会时间与联系） */}
      <section className="site-block site-block--dark site-block--about">
        <div className="site-block-inner site-block-inner--center">
          <img className="site-block-logo" src="/church-logo.jpeg" alt="利河伯教会" />
          <h2>认识教会</h2>
          <blockquote className="site-verse">
            <p className="site-verse-text">「{VERSE_COLUMNS.about.text}」</p>
            <footer>——{VERSE_COLUMNS.about.ref}</footer>
          </blockquote>
          <p className="site-block-copy">教会简介、异象与使命、信仰立场、聚会时间与地点，欢迎你走进利河伯。</p>
          <div className="site-block-actions">
            <a className="site-btn-primary" href="/about/">认识我们</a>
          </div>
          <div className="site-contact-grid" style={{ marginTop: 32 }}>
            <div className="site-contact-card">
              <p className="site-contact-icon" aria-hidden="true">☀</p>
              <b>主日敬拜</b>
              <span>每周日 · 欢迎你一同敬拜</span>
            </div>
            <div className="site-contact-card">
              <p className="site-contact-icon" aria-hidden="true">✎</p>
              <b>每周查经</b>
              <span>每周五 · Zoom 同步</span>
            </div>
            <div className="site-contact-card">
              <p className="site-contact-icon" aria-hidden="true">♡</p>
              <b>周间探访</b>
              <span>同工安排 · 关怀问候</span>
            </div>
          </div>
          <p className="site-contact-welcome" style={{ color: "#c7d3e6" }}>欢迎你走进利河伯，在宽阔之地得着安息。</p>
        </div>
      </section>
    </main>
  );
}