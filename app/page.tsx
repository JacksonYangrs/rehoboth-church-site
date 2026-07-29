"use client";

import { FormEvent, type CSSProperties, useEffect, useMemo, useState } from "react";

type GatheringStep = {
  title: string;
  short: string;
  time: string;
  lead: string;
  guide: string;
  prompt?: string;
};

type DailyReading = {
  title: string;
  passage: string;
  theme: string;
  summary: string;
  think: string;
  action: string;
};

const PLAN_START = new Date(2026, 6, 27);

const READINGS: DailyReading[] = [
  {
    title: "在安静中回到主前",
    passage: "诗篇 46:1–11",
    theme: "安静，知道我是神",
    summary:
      "风浪并没有立刻消失，诗人却邀请我们在动荡中回到神的同在。安静不是逃避，而是把心重新交给那位掌管万有的主。",
    think: "此刻有什么声音或忧虑，使我难以安静在主面前？",
    action: "今天留出十分钟，不急着解决事情，只把最挂心的一件事交托给主。",
  },
  {
    title: "把重担交给牧者",
    passage: "诗篇 23:1–6",
    theme: "我必不至缺乏",
    summary:
      "主不是在远处指路，而是亲自作我们的牧者。他知道我们的需要，也带领我们经过幽谷；在祂的同在里，惧怕可以被安稳取代。",
    think: "我正在为哪一件事感到缺乏或不安？我愿意怎样信靠主的带领？",
    action: "写下一项你想紧紧抓住的担忧，并用一句祷告把它交给主。",
  },
  {
    title: "在爱里彼此建立",
    passage: "约翰福音 13:34–35",
    theme: "彼此相爱",
    summary:
      "耶稣把爱留下作为门徒可被认出的记号。这份爱不是抽象的感受，而是在聆听、宽恕、陪伴与服事里，具体地活出来。",
    think: "今天我可以怎样让身边的人，从一个小行动感受到基督的爱？",
    action: "主动联系一位弟兄姊妹，问候他，并为他一件具体的事祷告。",
  },
  {
    title: "仰望那不改变的信实",
    passage: "耶利米哀歌 3:21–26",
    theme: "祂的怜悯每早晨都是新的",
    summary:
      "即使处在伤痛与等待中，先知仍选择数算主的慈爱。盼望不是来自环境转好，而是来自神永不止息的信实。",
    think: "回顾近来，有哪一处恩典提醒我：主仍在看顾？",
    action: "把一件蒙恩的事告诉小组，帮助彼此重新看见神的信实。",
  },
  {
    title: "在基督里得安息",
    passage: "马太福音 11:28–30",
    theme: "到我这里来",
    summary:
      "主没有催促疲乏的人再加把劲，祂邀请我们来到祂面前。跟随祂的样式，是在恩典中学习柔和与谦卑，领受心里的安息。",
    think: "我把什么重担扛得太久，以致忘了可以来到主面前？",
    action: "今天为自己预留一段不被打断的安息时间，向主诚实说出疲乏。",
  },
  {
    title: "让光照进日常",
    passage: "马太福音 5:13–16",
    theme: "你们是世上的光",
    summary:
      "门徒的见证不一定从大事开始。忠心、诚实、温柔地活在每天的关系与责任里，就能使人看见天父的美善。",
    think: "神把我放在今天的哪个场景里，让我可以成为一点光？",
    action: "选择一个最平常的场景，以一次耐心回应或真诚帮助来活出信仰。",
  },
  {
    title: "带着盼望走进新一周",
    passage: "腓立比书 4:4–9",
    theme: "思念这些事",
    summary:
      "保罗把忧虑转向祷告，把心思转向真实、可敬与美善。主所赐的平安，会在纷杂中守住我们的心怀意念。",
    think: "我需要用怎样的祷告，来代替心里不断重复的忧虑？",
    action: "写下一件值得感恩的事，并在今天至少一次用祷告来回应忧虑。",
  },
];

const STEPS: GatheringStep[] = [
  {
    title: "安静祷告",
    short: "安静",
    time: "3 分钟",
    lead: "全体",
    guide: "放下忙乱与期待，在主面前安静。可用一句简短祷告，邀请圣灵带领今天的时间。",
  },
  {
    title: "读经",
    short: "读经",
    time: "8 分钟",
    lead: "主持人领读",
    guide: "轮流朗读今天的经文；读完后保留片刻安静，留意最触动你的一句话。",
  },
  {
    title: "每日摘要",
    short: "摘要",
    time: "6 分钟",
    lead: "主持人领读",
    guide: "由本周主持人朗读《每日与主同行》对应章节的摘要，并提醒大家留意今天的主题。",
  },
  {
    title: "思想与讨论",
    short: "思想",
    time: "12 分钟",
    lead: "彼此分享",
    guide: "围绕经文与提示问题分享。不求完整答案，给彼此足够的聆听与回应空间。",
    prompt: "今天哪一句经文或哪一个提醒，最停留在你心里？",
  },
  {
    title: "同行与行动",
    short: "同行",
    time: "8 分钟",
    lead: "彼此守望",
    guide: "分享一个你愿意在今天或这周实践的回应。小组以具体、温柔的方式彼此鼓励与跟进。",
    prompt: "我愿意带着什么行动，与主同行？",
  },
  {
    title: "代祷与结束",
    short: "代祷",
    time: "8 分钟",
    lead: "全体祷告",
    guide: "收集大家的代祷事项，按需要分组或全体祷告，以感恩与交托结束聚会。",
  },
];

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

function dateKey(date: Date) {
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
}

function dailyContext(date: Date) {
  const midnight = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const start = new Date(PLAN_START.getFullYear(), PLAN_START.getMonth(), PLAN_START.getDate());
  const offset = Math.max(0, Math.floor((midnight.getTime() - start.getTime()) / 86_400_000));
  const reading = READINGS[offset % READINGS.length];
  return {
    key: dateKey(date),
    dayNumber: offset + 1,
    reading,
    dayName: WEEKDAYS[date.getDay()],
    dateLabel: new Intl.DateTimeFormat("zh-CN", { month: "long", day: "numeric", weekday: "long" }).format(date),
  };
}

function readStoredList(key: string) {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function firstIncomplete(completed: number[]) {
  return completed.length === STEPS.length
    ? STEPS.length - 1
    : Array.from({ length: STEPS.length }, (_, index) => index).find((index) => !completed.includes(index)) || 0;
}

export default function Home() {
  const [context] = useState(() => dailyContext(new Date()));
  const [completed, setCompleted] = useState<number[]>(() => readStoredList(`walk-with-lord-progress-${dateKey(new Date())}`)
    .map(Number)
    .filter((item) => Number.isInteger(item) && item >= 0 && item < STEPS.length));
  const [activeStep, setActiveStep] = useState(() => firstIncomplete(readStoredList(`walk-with-lord-progress-${dateKey(new Date())}`)
    .map(Number)
    .filter((item) => Number.isInteger(item) && item >= 0 && item < STEPS.length)));
  const [summaryOpen, setSummaryOpen] = useState(true);
  const [reflection, setReflection] = useState("");
  const [reflections, setReflections] = useState<string[]>(() => readStoredList(`walk-with-lord-reflections-${dateKey(new Date())}`));
  const [prayerText, setPrayerText] = useState("");
  const [prayers, setPrayers] = useState<string[]>(() => readStoredList(`walk-with-lord-prayers-${dateKey(new Date())}`));
  const [hostGuideOpen, setHostGuideOpen] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(`walk-with-lord-progress-${context.key}`, JSON.stringify(completed));
  }, [completed, context.key]);

  const progress = useMemo(() => Math.round((completed.length / STEPS.length) * 100), [completed.length]);
  const currentStep = STEPS[activeStep];

  const finishStep = (stepIndex = activeStep) => {
    setCompleted((previous) => {
      const next = previous.includes(stepIndex) ? previous : [...previous, stepIndex].sort((a, b) => a - b);
      const following = Array.from({ length: STEPS.length }, (_, i) => i).find((i) => !next.includes(i));
      if (following !== undefined) setActiveStep(following);
      return next;
    });
  };

  const submitReflection = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entry = reflection.trim();
    if (!entry) return;
    const next = [entry, ...reflections].slice(0, 3);
    setReflections(next);
    window.localStorage.setItem(`walk-with-lord-reflections-${context.key}`, JSON.stringify(next));
    setReflection("");
  };

  const submitPrayer = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const entry = prayerText.trim();
    if (!entry) return;
    const next = [entry, ...prayers].slice(0, 5);
    setPrayers(next);
    window.localStorage.setItem(`walk-with-lord-prayers-${context.key}`, JSON.stringify(next));
    setPrayerText("");
  };

  const scrollToFlow = () => document.getElementById("gathering-flow")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <main className="devotional-app">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="每日与主同行首页">
          <span className="wordmark-mark">同行</span>
          <span><b>每日与主同行</b><small>DAILY WALK</small></span>
        </a>
        <div className="header-actions">
          <span className="host-chip"><i>本周主持</i> 苏牧师</span>
          <button className="text-button" onClick={() => setHostGuideOpen(true)}>主持人指南 <span aria-hidden="true">↗</span></button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-route route-one" aria-hidden="true" />
        <div className="hero-route route-two" aria-hidden="true" />
        <div className="hero-copy">
          <p className="eyebrow"><span>✦</span> 今天的灵修已为你预备</p>
          <p className="date-label">{context.dateLabel}</p>
          <h1>{context.reading.title}</h1>
          <p className="passage">{context.reading.passage}</p>
          <p className="hero-theme">“{context.reading.theme}”</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={scrollToFlow}>开始今日聚会 <span aria-hidden="true">↓</span></button>
            <button className="quiet-button" onClick={() => { setActiveStep(0); scrollToFlow(); }}>先安静祷告</button>
          </div>
        </div>
        <aside className="progress-pod" aria-label={`今日进度 ${progress}%`}>
          <div className="progress-ring" style={{ "--progress": `${progress * 3.6}deg` } as CSSProperties}>
            <div><b>{completed.length}</b><span> / {STEPS.length}</span></div>
          </div>
          <p>今日聚会进度</p>
          <small>{completed.length === STEPS.length ? "今天的同行已完成" : `下一步：${currentStep.title}`}</small>
        </aside>
        <div className="week-strip" aria-label="本周灵修日期">
          {Array.from({ length: 7 }, (_, index) => {
            const day = new Date();
            day.setDate(day.getDate() - day.getDay() + index);
            const isToday = dateKey(day) === context.key;
            return <div className={`week-day ${isToday ? "today" : ""}`} key={index}><span>周{WEEKDAYS[day.getDay()]}</span><b>{day.getDate()}</b>{isToday && <i>今日</i>}</div>;
          })}
        </div>
      </section>

      <section className="content-shell" id="gathering-flow">
        <div className="section-intro">
          <div>
            <p className="section-label">TODAY’S GATHERING · 第 {context.dayNumber} 日</p>
            <h2>按着次序，一起与主同行</h2>
          </div>
          <p>完成一个环节后，页面会自动带你走向下一步；每个人的进度只保存在自己的设备上。</p>
        </div>

        <div className="meeting-layout">
          <nav className="step-rail" aria-label="聚会流程">
            {STEPS.map((step, index) => {
              const isDone = completed.includes(index);
              const isActive = activeStep === index;
              return (
                <button key={step.title} className={`rail-step ${isActive ? "active" : ""} ${isDone ? "done" : ""}`} onClick={() => setActiveStep(index)} aria-current={isActive ? "step" : undefined}>
                  <span>{isDone ? "✓" : String(index + 1).padStart(2, "0")}</span>
                  <b>{step.short}</b>
                </button>
              );
            })}
          </nav>

          <div className="flow-content">
            <article className="now-card">
              <div className="now-topline"><span>正在进行</span><span>{currentStep.time} · {currentStep.lead}</span></div>
              <div className="now-card-body">
                <div className="step-number">{String(activeStep + 1).padStart(2, "0")}</div>
                <div><h3>{currentStep.title}</h3><p>{currentStep.guide}</p></div>
              </div>
              {currentStep.prompt && <div className="prompt-note"><span>引导问题</span>{currentStep.prompt}</div>}
              <div className="now-actions">
                <button className="primary-button compact" onClick={() => finishStep()}>{completed.includes(activeStep) ? "已完成" : `完成${currentStep.title}`} <span aria-hidden="true">→</span></button>
                {completed.includes(activeStep) && activeStep < STEPS.length - 1 && <button className="quiet-button" onClick={() => setActiveStep(activeStep + 1)}>查看下一步</button>}
              </div>
            </article>

            <article className="reading-card">
              <div className="card-overline"><span>今日摘要</span><button onClick={() => setSummaryOpen((value) => !value)} aria-expanded={summaryOpen}>{summaryOpen ? "收起" : "展开"} <span aria-hidden="true">⌄</span></button></div>
              <div className="reading-heading"><p>《每日与主同行》</p><h3>{context.reading.title}</h3><span>{context.reading.passage}</span></div>
              {summaryOpen && <div className="summary-body"><p>{context.reading.summary}</p><div><b>默想</b><span>{context.reading.think}</span></div><div><b>同行</b><span>{context.reading.action}</span></div></div>}
            </article>

            <div className="sharing-grid">
              <article className="share-card">
                <div className="card-overline"><span>思想与回应</span><span className="tiny-label">可在小组分享</span></div>
                <h3>把今天听见的，留下来</h3>
                <p className="input-label">{context.reading.think}</p>
                <form onSubmit={submitReflection}>
                  <textarea value={reflection} onChange={(event) => setReflection(event.target.value)} placeholder="写下你的领受或今天愿意实践的一件事…" aria-label="写下思想与回应" rows={3} />
                  <button className="dark-button" type="submit">记录回应 <span aria-hidden="true">→</span></button>
                </form>
                {reflections.length > 0 && <div className="entry-list">{reflections.map((entry, index) => <p key={`${entry}-${index}`}><span>我的回应</span>{entry}</p>)}</div>}
              </article>

              <article className="prayer-card">
                <div className="card-overline"><span>代祷事项</span><span className="tiny-label">聚会最后收集</span></div>
                <h3>带到主面前，也彼此记念</h3>
                <form onSubmit={submitPrayer}>
                  <div className="prayer-input"><input value={prayerText} onChange={(event) => setPrayerText(event.target.value)} placeholder="例如：为家人的平安与康复祷告" aria-label="新增代祷事项" /><button type="submit" aria-label="添加代祷事项">+</button></div>
                </form>
                <div className="prayer-list">
                  {prayers.length > 0 ? prayers.map((prayer, index) => <p key={`${prayer}-${index}`}><span>✦</span>{prayer}</p>) : <p className="empty-prayer">还没有代祷事项。结束前，邀请大家写下一件需要守望的事。</p>}
                </div>
                <button className="finish-gathering" onClick={() => { STEPS.forEach((_, index) => finishStep(index)); }}>以祷告结束今天的聚会 <span aria-hidden="true">→</span></button>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section className="host-section">
        <div><p className="section-label">FOR THIS WEEK’S HOST</p><h2>主持人只需照着流程陪伴</h2></div>
        <div className="host-checklist"><p><span>01</span> 领大家安静、读经，并朗读今天摘要</p><p><span>02</span> 用引导问题鼓励每个人分享，不急着给答案</p><p><span>03</span> 收集代祷，确保每件事都被带到祷告里</p></div>
      </section>

      <footer className="site-footer"><span>每日与主同行</span><p>愿我们今天，一起安静聆听、思想、回应。</p><button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>回到今日内容 ↑</button></footer>

      {hostGuideOpen && <div className="modal-layer" role="dialog" aria-modal="true" aria-labelledby="host-guide-title"><button className="modal-mask" aria-label="关闭主持人指南" onClick={() => setHostGuideOpen(false)} /><section className="host-modal"><button className="modal-close" onClick={() => setHostGuideOpen(false)} aria-label="关闭">×</button><p className="section-label">HOST GUIDE · 本周由苏牧师主持</p><h2 id="host-guide-title">让聚会有空间，也有方向</h2><p>主持人的任务不是讲得更多，而是帮助每个人从经文、摘要与彼此的分享中听见主的声音。</p><ol><li>聚会前打开当天页面，确认经文与摘要。</li><li>每一个环节之间留出一点安静，邀请尚未分享的人自由回应。</li><li>代祷时可按需要分组；结束后记得用一句经文或感恩祷告收束。</li></ol><button className="primary-button compact" onClick={() => setHostGuideOpen(false)}>知道了，开始陪伴 <span aria-hidden="true">→</span></button></section></div>}
    </main>
  );
}
