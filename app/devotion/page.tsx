"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";

type ReadingBlock =
  | { type: "text"; text: string }
  | { type: "table"; rows: string[][] };

type ReadingSections = {
  summary: ReadingBlock[];
  thought: ReadingBlock[];
  practice: ReadingBlock[];
};

type Reading = {
  id: number;
  week: number;
  days: number[];
  dayLabel: string;
  title: string;
  scripture: string;
  keyVerse: string;
  blocks: ReadingBlock[];
  sections: ReadingSections;
  paragraphs: string[];
  reflectionPrompts: string[];
};

type Journal = { reflection: string; action: string; prayer: string };
type Progress = Record<string, number[]>;
type Journals = Record<string, Journal>;
type DayRecords = Record<string, { skipped?: boolean }>;
type Schedule = ReturnType<typeof getSchedule>;
type ReadingState = {
  key: string;
  reading: Reading | null;
  status: "loading" | "ready" | "error";
};

const PLAN_START_MONTH = 0;
const PLAN_START_DAY = 1;
const DAY = 24 * 60 * 60 * 1000;
const CYCLE_DAYS = 52 * 7;
const BIBLE_READER_URL = "https://jacksonyangrs.github.io/bible-cuv-phonetic/";
// 静态部署在 GitHub Pages 子路径下，公共资源需带上 basePath 前缀。
const ASSET_PREFIX = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const EMPTY_JOURNAL: Journal = { reflection: "", action: "", prayer: "" };
const STORAGE = {
  progress: "daily-walk-progress-v2",
  journals: "daily-walk-journals-v2",
  fontSize: "daily-walk-font-size-v2",
  dayRecords: "daily-walk-day-records-v1",
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

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function getSchedule(date: Date) {
  const start = new Date(date.getFullYear(), PLAN_START_MONTH, PLAN_START_DAY);
  const current = new Date(date);
  start.setHours(0, 0, 0, 0);
  current.setHours(0, 0, 0, 0);
  const elapsed = Math.floor((current.getTime() - start.getTime()) / DAY);
  const index = ((elapsed % CYCLE_DAYS) + CYCLE_DAYS) % CYCLE_DAYS;
  const week = Math.floor(index / 7) + 1;
  const day = (index % 7) + 1;
  const dateKey = formatDateKey(current);
  const dateLabel = `${current.getFullYear()} 年 ${current.getMonth() + 1} 月 ${current.getDate()} 日`;
  return { week, day, dateKey, dateLabel };
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function getMonthDates(anchor: Date) {
  const daysInMonth = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, index) => new Date(anchor.getFullYear(), anchor.getMonth(), index + 1));
}

function isSameDate(left: Date, right: Date) {
  return formatDateKey(left) === formatDateKey(right);
}

function getDayState(schedule: Schedule, today: Date, progress: Progress, dayRecords: DayRecords) {
  const completed = progress[schedule.dateKey]?.length ?? 0;
  const skipped = Boolean(dayRecords[schedule.dateKey]?.skipped);
  const isPast = startOfDay(new Date(schedule.dateKey)).getTime() < startOfDay(today).getTime();
  if (completed === STEPS.length) return "done";
  if (skipped) return "skipped";
  if (isPast) return "missed";
  return "open";
}

function isSectionLine(text: string) {
  return /^(?:注释：|\d+[.．、]\s*[^，。；]{0,28}$|[一二三四五六七八九十]+[、．.])/.test(text.trim());
}

function renderReadingBlock(block: ReadingBlock, key: string) {
  if (block.type === "table") {
    return (
      <div className="devotion-table-wrap" key={key}>
        <table className="devotion-table">
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`${key}-row-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${key}-cell-${rowIndex}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return <p className={isSectionLine(block.text) ? "section-line" : ""} key={key}>{block.text}</p>;
}

function ReadingSection({ blocks, label, title }: { blocks: ReadingBlock[]; label: string; title: string }) {
  if (blocks.length === 0) return null;

  return (
    <section className="reading-section">
      <div className="reading-section-heading">
        <span>{label}</span>
        <h3>{title}</h3>
      </div>
      <div className="reading-section-body">
        {blocks.map((block, index) => renderReadingBlock(block, `${label}-${index}`))}
      </div>
    </section>
  );
}

export default function DevotionPage() {
  const [today] = useState(() => startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState(() => startOfDay(new Date()));
  const [readingState, setReadingState] = useState<ReadingState>({ key: "", reading: null, status: "loading" });
  const [fontSize, setFontSize] = useState(() => clampFontSize(readStored(STORAGE.fontSize, 21)));
  const [progress, setProgress] = useState<Progress>(() => readStored(STORAGE.progress, {}));
  const [journals, setJournals] = useState<Journals>(() => readStored(STORAGE.journals, {}));
  const [dayRecords, setDayRecords] = useState<DayRecords>(() => readStored(STORAGE.dayRecords, {}));
  const [activeStep, setActiveStep] = useState(0);
  const [showGuide, setShowGuide] = useState(false);

  const schedule = useMemo(() => getSchedule(selectedDate), [selectedDate]);
  const monthDates = useMemo(() => getMonthDates(selectedDate), [selectedDate]);
  const isTodaySelected = isSameDate(selectedDate, today);
  const readingKey = `${schedule.week}-${schedule.day}`;
  const reading = readingState.key === readingKey ? readingState.reading : null;
  const isLoading = readingState.key !== readingKey || readingState.status === "loading";
  const loadError = readingState.key === readingKey && readingState.status === "error";

  useEffect(() => {
    const controller = new AbortController();
    void fetch(`${ASSET_PREFIX}/devotion/week-${schedule.week}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load devotion");
        return response.json() as Promise<{ readings: Reading[] }>;
      })
      .then((payload) => {
        const match = payload.readings.find((item) => item.days.includes(schedule.day)) ?? null;
        setReadingState({ key: readingKey, reading: match, status: "ready" });
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        setReadingState({ key: readingKey, reading: null, status: "error" });
      });
    return () => controller.abort();
  }, [readingKey, schedule.day, schedule.week]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.fontSize, String(fontSize));
  }, [fontSize]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.progress, JSON.stringify(progress));
  }, [progress]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.journals, JSON.stringify(journals));
  }, [journals]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE.dayRecords, JSON.stringify(dayRecords));
  }, [dayRecords]);

  const completedSteps = progress[schedule.dateKey] ?? [];
  const journal = journals[schedule.dateKey] ?? EMPTY_JOURNAL;
  const currentDayState = getDayState(schedule, today, progress, dayRecords);
  const missedCount = useMemo(() => {
    const start = new Date(today.getFullYear(), PLAN_START_MONTH, PLAN_START_DAY);
    const dayCount = Math.max(0, Math.floor((today.getTime() - start.getTime()) / DAY));
    return Array.from({ length: dayCount }, (_, index) => getSchedule(addDays(start, index)))
      .filter((item) => getDayState(item, today, progress, dayRecords) === "missed").length;
  }, [dayRecords, progress, today]);
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

  const toggleSkipped = () => {
    setDayRecords((current) => ({
      ...current,
      [schedule.dateKey]: { skipped: !current[schedule.dateKey]?.skipped },
    }));
  };

  const readerStyle = { "--reader-font-size": `${fontSize}px` } as CSSProperties;
  const allStepsDone = completedSteps.length === STEPS.length;
  const bibleReaderHref = `${BIBLE_READER_URL}?reference=${encodeURIComponent(reading?.scripture ?? "")}`;

  return (
    <main className="devotion-page">
      <section className="today-intro" id="today">
        <p className="eyebrow">TODAY&apos;S DEVOTION · {schedule.dateLabel}</p>
        <div className="intro-content">
          <div>
            <p className="week-label">{isTodaySelected ? "今天" : "补读"} · 第 {schedule.week} 周 · 第 {schedule.day === 7 ? "6、7" : schedule.day} 日</p>
            <h1>{isLoading ? "正在打开今天的灵修…" : reading?.title ?? "复习与祷告日"}</h1>
            <p className="intro-copy">年度计划从每年 1 月 1 日开始。打开先看今天，也可以从日历补上过去没有完成的灵修。</p>
          </div>
          <div className="host-card">
            <span>本周主持人</span>
            <b>苏牧师</b>
            <small>领读摘要 · 引导分享 · 收集代祷</small>
          </div>
        </div>
      </section>

      <section className="content-shell">
        <aside className="side-column" aria-label="灵修进度与聚会流程">
        <section className="meeting-card">
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
        </section>

        <section className="calendar-card" aria-label="灵修日历">
          <div className="calendar-heading">
            <div>
              <p className="eyebrow">YEAR PLAN</p>
              <h2>{selectedDate.getMonth() + 1} 月日历</h2>
            </div>
            <button type="button" onClick={() => setSelectedDate(today)} disabled={isTodaySelected}>今天</button>
          </div>
          <p className="calendar-advice">
            {currentDayState === "done" && "这一天已完成，可继续复习或查看记录。"}
            {currentDayState === "skipped" && "这一天已记为未领修，不计入待补提醒。"}
            {currentDayState === "missed" && "这一天还没有完成，建议今天补读后再进入今日内容。"}
            {currentDayState === "open" && `建议阅读第 ${schedule.week} 周第 ${schedule.day === 7 ? "6、7" : schedule.day} 日${reading?.scripture ? `：${reading.scripture}` : "。"} `}
          </p>
          <div className="calendar-grid">
            {monthDates.map((date) => {
              const item = getSchedule(date);
              const state = getDayState(item, today, progress, dayRecords);
              const selected = item.dateKey === schedule.dateKey;
              return (
                <button
                  type="button"
                  key={item.dateKey}
                  className={`${state} ${selected ? "selected" : ""} ${isSameDate(date, today) ? "today" : ""}`}
                  onClick={() => setSelectedDate(startOfDay(date))}
                  aria-label={`${item.dateLabel}，第 ${item.week} 周第 ${item.day} 日`}
                >
                  <span>{date.getDate()}</span>
                  <small>{state === "done" ? "✓" : state === "skipped" ? "休" : state === "missed" ? "补" : ""}</small>
                </button>
              );
            })}
          </div>
          <div className="calendar-legend">
            <span><i className="legend-done"></i>已完成</span>
            <span><i className="legend-missed"></i>待补</span>
            <span><i className="legend-skipped"></i>未领修</span>
          </div>
          <div className="calendar-actions">
            <button type="button" className="soft-button" onClick={toggleSkipped}>
              {dayRecords[schedule.dateKey]?.skipped ? "取消未领修记录" : "这天没有领修"}
            </button>
            {missedCount > 0 && <span>今年还有 {missedCount} 天待补</span>}
          </div>
        </section>
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
                <div className="bible-actions">
                  <a className="scripture-link" href={bibleReaderHref}>打开圣经电子书读经</a>
                  <button type="button" onClick={() => completeStep(1)}>我已读完经文</button>
                </div>
                {reading.keyVerse && <blockquote><span>钥节</span>{reading.keyVerse}</blockquote>}
              </header>
              <div className="reading-body">
                <ReadingSection blocks={reading.sections.summary} label="第一段 · 摘要" title="今日内容摘要" />
                <ReadingSection blocks={reading.sections.thought} label="第二段 · 思想" title="需要思想的部分" />
                <ReadingSection blocks={reading.sections.practice} label="第三段 · 与主同行" title="与主同行的实践" />
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
    </main>
  );
}
