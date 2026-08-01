import type { Metadata } from "next";
import { VERSE_COLUMNS, GROWTH_SUBCOLUMNS, BUILDING_TOPICS, type Verse } from "./verses";
import SubCard from "./components/SubCard";

export const metadata: Metadata = {
  title: "利河伯教会",
  description: "在这里敬拜，在这里同行，在这里见证神的信实。",
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
        actionHref="/worship/"
        actionLabel="进入线上敬拜"
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

      {/* 5. 查经公告 */}
      <PhotoBlock
        eyebrow="BIBLE STUDY · 查经公告"
        title="查经公告"
        verse={VERSE_COLUMNS["bible-study"]}
        desc="每周查经主题、查考经文、日期时间与 Zoom 链接。神的话语是我们脚前的灯，路上的光。"
        photo="/bible-study-film.png"
        actionHref="/bible-study/"
        actionLabel="查看查经公告"
      />

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

      {/* 7. 奉献 */}
      <section className="site-block site-block--gold">
        <div className="site-block-inner site-block-inner--center">
          <p className="eyebrow">GIVING · 奉献</p>
          <h2>奉献</h2>
          <blockquote className="site-verse site-verse--paper">
            <p className="site-verse-text">「{VERSE_COLUMNS.giving.text}」</p>
            <footer>——{VERSE_COLUMNS.giving.ref}</footer>
          </blockquote>
          <p className="site-block-copy">日常奉献、建堂奉献与特别事工奉献，支持教会各项服侍。捐得乐意的人，是神所喜爱的。</p>
          <div className="site-block-actions">
            <a className="site-btn-primary" href="/giving/">查看奉献方式</a>
          </div>
        </div>
      </section>

      {/* 8. 爱心窗口 */}
      <PhotoBlock
        eyebrow="CARE · 爱心窗口"
        title="爱心窗口"
        verse={VERSE_COLUMNS.care}
        desc="为不方便面对面表达的人提供线上、可匿名的联系渠道：家庭、关系、子女教育、信仰疑问与情绪压力。"
        photo="/bible-study-hero.png"
        actionHref="/care/"
        actionLabel="进入爱心窗口"
      />

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
