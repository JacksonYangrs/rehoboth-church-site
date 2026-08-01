"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type Reading = {
  id: number;
  week: number;
  days: number[];
  dayLabel: string;
  title: string;
  scripture: string;
  keyVerse: string;
  paragraphs: string[];
  reflectionPrompts: string[];
};

type Journal = { reflection: string; action: string; prayer: string };
type Progress = Record<string, number[]>;
type Journals = Record<string, Journal>;

const PLAN_START = new Date(2026, 6, 27);
const DAY = 24 * 60 * 60 * 1000;
const CYCLE_DAYS = 52 * 7;
const EMPTY_JOURNAL: Journal = { reflection: "", action: "", prayer: "" };
const STORAGE = {
  progress: "daily-walk-progress-v2",
  journals: "daily-walk-journals-v2",
  fontSize: "daily-walk-font-size-v2",
};

const STEPS = [
  { title: "安静祷告", note: "安静片刻，将心转向主。", icon: "1" },
  { title: "读经", note: "按今日经文一同诵读。", icon: "2" },
  { title: "每日摘要", note: "阅读今天的原文内容。", icon: "3" },
  { title: "思想讨论", note: "彼此聆听，分享领受。", icon: "4" },
  { title: "同行行动", note: "回应神，定下可实行的一步。", icon: "5" },
  { title: "代祷结束", note: "收集代祷，一同交托。", icon: "6" },
];

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function clampFontSize(value: number) {
  return Math.max(18, Math.min(28, value));
}

function getSchedule(date: Date) {
  const start = new Date(PLAN_START);
  const current = new Date(date);
  start.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  const elapsed = Math.floor((current.getTime() - start.getTime()) / DAY);
  const index = ((elapsed % CYCLE_DAYS) + CYCLE_DAYS) % CYCLE_DAYS;
  const week = Math.floor(index / 7) + 1;
  const day = (index % 7) + 1;
  const dateKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}-${String(current.getDate()).padStart(2, "0")}`;
  const dateLabel = `${current.getFullYear()} 年 ${current.getMonth() + 1} 月 ${current.getDate()} 日`;
  return { week, day, dateKey, dateLabel };
}

function isSectionLine(text: string) {
  return /^(?:注释：|\d+[.．、]\s*[^，。；]{0,28}$|[一二三四五六七八九十]+[、．.])/.test(text.trim());
}

export default function Home() {
  const [schedule] = useState(() => getSchedule(new Date()));
  const [reading, setReading] = useState<Reading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [fontSize, setFontSize] = useState(() => clampFontSize(readStored(STORAGE.fontSize, 21)));
  const [progress, setProgress] = useState<Progress>(() => readStored(STORAGE.progress, {}));
  const [journals, setJournals] = useState<Journals>(() => readStored(STORAGE.journals, {}));
  const [activeStep, setActiveStep] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`/api/devotion?week=${schedule.week}&day=${schedule.day}`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load devotion");
        return response.json() as Promise<{ reading: Reading | null }>;
      })
      .then((payload) => setReading(payload.reading))
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setLoadError(true);
      })
      .finally(() => setIsLoading(false));
    return () => controller.abort();
  }, [schedule.day, schedule.week]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.fontSize, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.progress, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.journals, JSON.stringify(journals));
  }, [journals]);

  const completedSteps = progress[schedule.dateKey] ?? [];
  const journal = journals[schedule.dateKey] ?? EMPTY_JOURNAL;
  const discussionPrompts = useMemo(() => {
    if (!reading) return [];
    const questions = reading.reflectionPrompts.filter((item) => /[？?]/.test(item));
    return (questions.length ? questions : reading.reflectionPrompts).slice(-3);
  }, [reading]);

  const completeStep = (index: number) => {
    setActiveStep(index);
    setProgress((current) => {
      const today = current[schedule.dateKey] ?? [];
      if (today.includes(index)) return current;
      return { ...current, [schedule.dateKey]: [...today, index].sort((a, b) => a - b) };
    });
  };

  const updateJournal = (field: keyof Journal, value: string) => {
    setJournals((current) => ({
      ...current,
      [schedule.dateKey]: { ...(current[schedule.dateKey] ?? EMPTY_JOURNAL), [field]: value },
    }));
  };

  const readerStyle = { "--reader-font-size": `${fontSize}px` } as CSSProperties;
  const allStepsDone = completedSteps.length === STEPS.length;

  return (
    <main className="devotion-page">
      <header className="site-header">
        <a className="wordmark" href="#today" aria-label="回到今日灵修">
          <span className="wordmark-mark">十</span>
          <span><b>每日与主同行</b><small>WALK WITH THE LORD</small></span>
        </a>
        <p className="header-note">无需登录 · 进度保存在本机</p>
      </header>

      <section className="today-intro" id="today">
        <p className="eyebrow">TODAY&apos;S DEVOTION · {schedule.dateLabel}</p>
        <div className="intro-content">
          <div>
            <p className="week-label">第 {schedule.week} 周 · 第 {schedule.day === 7 ? "6、7" : schedule.day} 日</p>
            <h1>{isLoading ? "正在打开今天的灵修…" : reading?.title ?? "复习与祷告日"}</h1>
            <p className="intro-copy">打开即可进入今天的内容，安静聆听、思想、回应，与弟兄姊妹一同前行。</p>
          </div>
          <div className="host-card">
            <span>本周主持人</span>
            <b>苏牧师</b>
            <small>领读摘要 · 引导分享 · 收集代祷</small>
          </div>
        </div>
      </section>

      <section className="content-shell">
        <aside className="meeting-card" aria-label="今日聚会流程">
          <div className="meeting-heading">
            <div><p className="eyebrow">GATHER TOGETHER</p><h2>今日聚会</h2></div>
            <span>{completedSteps.length}/6</span>
          </div>
          <ol className="steps-list">
            {STEPS.map((step, index) => {
              const done = completedSteps.includes(index);
              return (
                <li key={step.title} className={`${activeStep === index ? "active" : ""} ${done ? "done" : ""}`}>
                  <button type="button" onClick={() => { setActiveStep(index); if (!done) completeStep(index); }}>
                    <span className="step-number">{done ? "✓" : step.icon}</span>
                    <span><b>{step.title}</b><small>{step.note}</small></span>
                  </button>
                </li>
              );
            })}
          </ol>
          <p className={`completion-note ${allStepsDone ? "finished" : ""}`}>{allStepsDone ? "今天的同行已完成，愿主赐平安。" : "点击每一步，记录今天的同行。"}</p>
        </aside>

        <div className="reader-column">
          <div className="reader-toolbar" aria-label="阅读设置">
            <span>舒适阅读</span>
            <div className="font-controls">
              <button type="button" onClick={() => setFontSize((size) => clampFontSize(size - 1))} aria-label="缩小字体">A−</button>
              <output>{fontSize}px</output>
              <button type="button" onClick={() => setFontSize((size) => clampFontSize(size + 1))} aria-label="放大字体">A+</button>
            </div>
          </div>

          {isLoading && <div className="loading-card"><span></span><p>正在预备今天的灵修内容…</p></div>}
          {loadError && <div className="message-card error"><h2>内容暂时没有打开</h2><p>请检查网络后刷新页面。今天的聚会流程仍可继续记录。</p></div>}

          {!isLoading && !loadError && reading && (
            <article className="reader-card" style={readerStyle}>
              <header className="reading-header">
                <p>《每日与主同行》 · 苏颖智</p>
                <h2>{reading.title}</h2>
                <div className="scripture-row"><span>今日经文</span><b>{reading.scripture}</b></div>
                {reading.keyVerse && <blockquote><span>钥节</span>{reading.keyVerse}</blockquote>}
              </header>
              <div className="reading-body">
                {reading.paragraphs.map((paragraph, index) => (
                  <p className={isSectionLine(paragraph) ? "section-line" : ""} key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
                ))}
              </div>
              <div className="reading-complete">
                <span>读完原文后，带着所领受的进入分享。</span>
                <button type="button" className="primary-button" onClick={() => completeStep(2)}>{completedSteps.includes(2) ? "已完成阅读 ✓" : "完成今日阅读"}</button>
              </div>
              <footer className="source-credit">内容：苏颖智《每日与主同行》 · 资料来源：WellsOfGrace.com</footer>
            </article>
          )}

          {!isLoading && !loadError && !reading && (
            <article className="message-card review-card">
              <p className="eyebrow">第 {schedule.week} 周 · 第 {schedule.day} 日</p>
              <h2>复习与祷告日</h2>
              <p>源文件没有提供今天独立的篇章。可复习本周前一篇经文，安静祷告，并在小组中分享神的提醒。</p>
              <button type="button" className="primary-button" onClick={() => completeStep(2)}>完成复习</button>
            </article>
          )}

          <section className="sharing-card" id="sharing">
            <button className="sharing-heading" type="button" onClick={() => setShowGuide((shown) => !shown)} aria-expanded={showGuide}>
              <span><p className="eyebrow">SHARE & RESPOND</p><h2>思想与同行分享</h2></span>
              <span className="expand-icon">{showGuide ? "−" : "+"}</span>
            </button>
            {showGuide && <div className="sharing-content">
              <div className="prompt-panel">
                <h3>可由主持人选读</h3>
                {discussionPrompts.length > 0 ? <ul>{discussionPrompts.map((prompt) => <li key={prompt}>{prompt}</li>)}</ul> : <p>今天的经文带给你什么提醒？</p>}
              </div>
              <label>我今天的思想与领受<textarea value={journal.reflection} onChange={(event) => updateJournal("reflection", event.target.value)} placeholder="写下一句让你停下来的话，或一个愿意分享的领受…" /></label>
              <label>我要同行的一步<textarea value={journal.action} onChange={(event) => updateJournal("action", event.target.value)} placeholder="这周我愿意具体怎样回应神？" /></label>
              <button type="button" className="soft-button" onClick={() => completeStep(4)}>记录同行行动</button>
            </div>}
          </section>

          <section className="prayer-card">
            <div><p className="eyebrow">PRAY TOGETHER</p><h2>代祷事项</h2><p>将每个人的需要带到主面前；这些文字只保存在你的这台设备。</p></div>
            <div>
              <textarea value={journal.prayer} onChange={(event) => updateJournal("prayer", event.target.value)} placeholder="例如：为家人、工作、健康、福音对象祷告…" />
              <button type="button" className="primary-button" onClick={() => completeStep(5)}>交托并结束祷告</button>
            </div>
          </section>
        </div>
      </section>

      <footer className="site-footer"><span>每日与主同行 · 今日自动定位</span><span>愿你在神的话语中得力</span></footer>
    </main>
  );
}
