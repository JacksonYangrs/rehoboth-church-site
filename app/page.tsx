"use client";

import { FormEvent, useState } from "react";

const media = [
  { label: "主日敬拜", title: "在旷野中看见恩典", meta: "2026.07.26 · 林牧师", color: "blue" },
  { label: "讲道主题", title: "成为祝福的器皿", meta: "2026.07.19 · 周传道", color: "gold" },
  { label: "特别聚会", title: "年中感恩敬拜", meta: "2026.06.28 · 利河伯教会", color: "teal" },
];

const growth = [
  ["儿童主日学", "12岁以下", "教养孩童，使他走当行的道。", "箴言 22:6", "child"],
  ["青少年团契", "13—18岁", "总要在言语、行为、爱心、信心上作榜样。", "提摩太前书 4:12", "youth"],
  ["姊妹团契", "彼此相伴", "最要紧的是彼此切实相爱。", "彼得前书 4:8", "sister"],
  ["弟兄团契", "一起建造", "两个人总比一个人好。", "传道书 4:9", "brother"],
  ["教会探访", "爱的行动", "作在我这弟兄中一个最小的身上。", "马太福音 25:40", "visit", "访"],
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<typeof media[number] | null>(null);
  const [sent, setSent] = useState(false);

  const go = () => setMenuOpen(false);
  const submitLove = (e: FormEvent<HTMLFormElement>) => { e.preventDefault(); setSent(true); };

  return (
    <main className="site">
      <header className="topbar">
        <a className="brand" href="#top" onClick={go}><img src="/church-logo.jpeg" alt="利河伯教会 Logo" /><span><b>利河伯教会</b><small>REHOBOTH CHURCH</small></span></a>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="打开导航">☰</button>
        <nav className={menuOpen ? "nav open" : "nav"}>
          {[["首页", "top"], ["线上敬拜", "worship"], ["教会成长", "growth"], ["查经公告", "bible-study"], ["建堂专题", "building"], ["奉献", "offering"], ["爱心窗口", "love"], ["认识教会", "about"]].map(([name, id]) => <a href={`#${id}`} key={id} onClick={go}>{name}</a>)}
        </nav>
      </header>

      <section className="hero" id="top">
        <div className="hero-inner"><p className="eyebrow">WELCOME TO REHOBOTH</p><h1>在这里敬拜，<br /><em>在这里见证。</em></h1><p className="hero-lead">利河伯，意为“宽阔之地”。这里记录神在我们中间的工作，也邀请每一个人来到祂面前，得着安慰、盼望与新的开始。</p><div className="hero-buttons"><a className="btn gold" href="#worship">进入线上敬拜 <span>→</span></a><a className="btn outline" href="#about">认识利河伯</a></div></div>
        <div className="hero-mark" aria-hidden="true"><div className="hero-circle"></div><div className="hero-cross">✝</div><div className="hero-wave wave-one"></div><div className="hero-wave wave-two"></div><p>神在这里<br />为我们开了宽阔之地</p></div>
        <div className="hero-strip"><span>本周主日崇拜</span><b>每周日 · 上午 10:00</b><i></i><span>线上同步更新</span></div>
      </section>

      <section className="welcome section" id="about"><div><p className="label">OUR HEART</p><h2>一群在恩典中<br />彼此同行的人。</h2></div><div><p className="serif-copy">我们渴望成为一间以基督为中心、以圣经为根基、以爱彼此连接的教会。在敬拜、团契、服事与宣教中，一起经历神的同在。</p><p className="verse">“你们若有彼此相爱的心，众人因此就认出你们是我的门徒了。”<br /><small>约翰福音 13:35</small></p></div></section>

      <section className="section" id="worship"><div className="heading"><div><p className="label">WORSHIP & MESSAGE</p><h2>线上敬拜</h2><p className="heading-note">来啊，我们要屈身敬拜，在造我们的耶和华面前跪下。<small>诗篇 95:6</small></p></div><a className="link" href="#worship">查看全部资料 →</a></div><div className="feature" onClick={() => setSelected(media[0])} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setSelected(media[0])}><div className="feature-art"><span className="play">▶</span><small>主日敬拜 · 2026.07.26</small></div><div className="feature-info"><p className="label">LATEST MESSAGE</p><h3>在旷野中看见恩典</h3><p>“我要向山举目；我的帮助从何而来？我的帮助从造天地的耶和华而来。”</p><div className="meta">诗篇 121 篇　·　林牧师　·　约 42 分钟</div><button className="btn gold small">开始观看 →</button></div></div><div className="media-grid">{media.slice(1).map(item => <article className="media-card" key={item.title} onClick={() => setSelected(item)}><div className={`media-thumb ${item.color}`}><span className="play tiny">▶</span><b>{item.label}</b></div><div className="media-body"><small>{item.meta}</small><h3>{item.title}</h3><p>一起在神的话语中学习、思想与回应。</p><span className="link">观看信息 →</span></div></article>)}</div></section>

      <section className="dark-section" id="growth"><div className="section"><div className="heading light"><div><p className="label">LIFE TOGETHER</p><h2>教会成长</h2><p className="heading-note">记录每一次相聚，纪念神在我们中间的工作。<small>诗篇 126:3</small></p></div><a className="link light-link" href="#growth">查看成长记录 →</a></div><div className="growth-grid">{growth.map(([title, sub, quote, ref, cls, mark]) => <article className={`growth-card ${cls}`} key={title}><div className="growth-visual"><span>{sub}</span><b>{mark || title.slice(0, 1)}</b></div><div><h3>{title}</h3><p>“{quote}”</p><small>{ref}</small><a href="#growth">照片与视频 →</a></div></article>)}</div></div></section>

      <section className="section study" id="bible-study"><div className="study-box"><div className="study-date"><b>每周五</b><span>7:30 PM</span></div><div><p className="label">BIBLE STUDY NOTICE</p><h2>每周查经公告</h2><p>本周五，我们继续在线上一起查考圣经。欢迎提前阅读经文，带着问题和期待参加 Zoom 查经。</p><div className="study-meta"><span>本周主题：约翰福音中的生命</span><span>形式：Zoom 同步</span></div></div><a className="btn dark" href="#bible-study">查看公告 →</a></div></section>

      <section className="building section" id="building"><div className="building-visual"><div className="building-disc">✝</div><span>REHOBOTH<br /><b>宽阔之地</b></span></div><div><p className="label">BUILDING THE HOUSE</p><h2>建堂专题<br /><em>一步一步，见证恩典。</em></h2><p className="serif-copy">从异象开始，到一砖一瓦；我们记录建堂的每一个脚步，也邀请你一起祷告、参与、见证神在利河伯教会所做的新事。</p><div className="steps"><div><b>01</b><span>异象与祷告</span></div><div className="active"><b>02</b><span>寻找场地</span></div><div><b>03</b><span>建造与奉献</span></div></div><a className="btn dark" href="#building">进入建堂专题 →</a></div></section>

      <section className="offering-band" id="offering"><div className="section offering"><div><p className="label">GIVING WITH JOY</p><h2>奉献</h2><p className="offering-verse">“捐得乐意的人，是神所喜爱的。”<small>哥林多后书 9:7</small></p><p>愿我们的奉献成为敬拜，也成为教会继续牧养、传福音和建造的祝福。</p></div><div className="bank-card"><p>奉献账户</p><div><span>账户名称</span><b>利河伯教会</b></div><div><span>开户银行</span><b className="placeholder">待教会填写</b></div><div><span>银行账号</span><b className="placeholder">待教会填写</b></div><small>奉献时请备注：日常奉献 / 建堂奉献 / 特别事工</small><button className="btn gold small">复制账户信息</button></div></div></section>

      <section className="section love" id="love"><div><p className="label">A CARING WINDOW</p><h2>爱心窗口</h2><p className="serif-copy">如果你正面对家庭、人际关系、教育或信仰上的困惑，可以把心里的话写给我们。你可以选择匿名，教会同工会以尊重和关怀的态度回应。</p><p className="privacy-note">你的信息只会交给授权的关怀同工查看。这里不是紧急医疗或危机服务渠道。</p></div><form className="love-form" onSubmit={submitLove}><label>我想说说 <span>可匿名</span><textarea placeholder="请写下你愿意分享的事情……" required /></label><label className="check"><input type="checkbox" /> 我愿意留下联系方式，方便教会回复我</label><button className="btn dark" type="submit">{sent ? "我们已经收到，谢谢你" : "送出我的心声 →"}</button></form></section>

      <footer className="footer"><div className="footer-brand"><img src="/church-logo.jpeg" alt="" /><span><b>利河伯教会</b><small>REHOBOTH CHURCH</small></span></div><p>在这里敬拜，在这里见证。<br />© 2026 利河伯教会 · 与我们一起同行</p><a href="#top">回到顶部 ↑</a></footer>

      {selected && <div className="modal"><button className="mask" onClick={() => setSelected(null)} aria-label="关闭"></button><div className="modal-card"><button className="close" onClick={() => setSelected(null)}>×</button><div className="modal-screen"><span className="play">▶</span><p>视频播放演示区</p><small>接入真实视频链接后即可播放</small></div><p className="label">{selected.label}</p><h2>{selected.title}</h2><p>这里将播放教会上传的视频、敬拜记录或讲道信息。</p><button className="btn gold" onClick={() => setSelected(null)}>返回资料库</button></div></div>}
    </main>
  );
}
