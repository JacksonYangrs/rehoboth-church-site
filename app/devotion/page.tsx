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
const TOTAL_WEEKS = 52; // 全年计划共 52 周（每周 6 天 + 主日休息）
const BIBLE_READER_URL = "https://jacksonyangrs.github.io/bible-cuv-phonetic/";
// 圣经书卷缩写 -> 完整名（与阅读器 ref 解析一致）
const BOOK_ABBR: Record<string, string> = {
  创: "创世记", 出: "出埃及记", 利: "利未记", 民: "民数记", 申: "申命记",
  书: "约书亚记", 士: "士师记", 得: "路得记", 撒上: "撒母耳记上", 撒下: "撒母耳记下",
  王上: "列王纪上", 王下: "列王纪下", 代上: "历代志上", 代下: "历代志下",
  拉: "以斯拉记", 尼: "尼希米记", 斯: "以斯帖记", 伯: "约伯记", 诗: "诗篇",
  箴: "箴言", 传: "传道书", 歌: "雅歌", 赛: "以赛亚书", 耶: "耶利米书",
  哀: "耶利米哀歌", 结: "以西结书", 但: "但以理书", 何: "何西阿书", 珥: "约珥书",
  摩: "阿摩司书", 俄: "俄巴底亚书", 拿: "约拿书", 弥: "弥迦书", 鸿: "那鸿书",
  哈: "哈巴谷书", 番: "西番雅书", 该: "哈该书", 亚: "撒迦利亚书", 玛: "玛拉基书",
  太: "马太福音", 可: "马可福音", 路: "路加福音", 约: "约翰福音", 徒: "使徒行传",
  罗: "罗马书", 林前: "哥林多前书", 林后: "哥林多后书", 加: "加拉太书",
  弗: "以弗所书", 腓: "腓立比书", 西: "歌罗西书", 帖前: "帖撒罗尼迦前书",
  帖后: "帖撒罗尼迦后书", 提前: "提摩太前书", 提后: "提摩太后书", 多: "提多书",
  门: "腓利门书", 来: "希伯来书", 雅: "雅各书", 彼前: "彼得前书", 彼后: "彼得后书",
  约壹: "约翰一书", 约贰: "约翰二书", 约叁: "约翰三书", 犹: "犹大书", 启: "启示录",
};
const CN_NUM: Record<string, number> = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10, 廿: 20, 卅: 30, 零: 0 };
function cnToNum(s: string): number {
  if (!s) return 0;
  if (/^[十廿卅零]$/.test(s)) return CN_NUM[s] ?? 0;
  const m = s.match(/^([一二三四五六七八九])?([十廿卅])([一二三四五六七八九])?$/);
  if (m) return (m[1] ? CN_NUM[m[1]] ?? 0 : 1) * (CN_NUM[m[2]] ?? 0) + (m[3] ? CN_NUM[m[3]] ?? 0 : 0);
  // 连续数字：如"一二"=12、"一零三"=103
  let total = 0;
  for (const ch of s) {
    if (ch === "零") { total *= 10; continue; }
    total = total * 10 + (CN_NUM[ch] ?? 0);
  }
  return total || 0;
}
// 「创一至二章」「箴言三章」等缩写经文范围 -> 完整书卷名+起始章（阅读器 ref）
// 按缩写长度降序匹配（"约壹"先于"约"），并容忍"帖前书"这类"书"字
function scriptureRef(scripture: string): string | null {
  const abbrs = Object.keys(BOOK_ABBR).sort((a, b) => b.length - a.length);
  for (const abbr of abbrs) {
    if (!scripture.startsWith(abbr)) continue;
    const rest = scripture.slice(abbr.length);
    const m = rest.match(/^(?:书)?([一二三四五六七八九十廿卅零]+)/);
    if (!m) return null;
    if (!cnToNum(m[1])) return null;
    return `${BOOK_ABBR[abbr]}${m[1]}章`;
  }
  return null;
}
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
  return Math.max(20, Math.min(30, value));
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

// 年度计划：每年 1 月 1 日开始，每周日（主日）休息，每周读 6 天。
// date -> 计划索引：自 1 月 1 日（含）数到当天的非周日天数。
function getSchedule(date: Date) {
  const start = new Date(date.getFullYear(), PLAN_START_MONTH, PLAN_START_DAY);
  start.setHours(0, 0, 0, 0);
  const current = new Date(date);
  current.setHours(0, 0, 0, 0);
  const isRestDay = current.getDay() === 0; // 主日（周日）休息

  let count = 0;
  let cursor = new Date(start);
  while (cursor.getTime() <= current.getTime()) {
    if (cursor.getDay() !== 0) count++; // 跳过主日
    cursor = new Date(cursor.getTime() + DAY);
  }
  let index = count - 1;
  if (index < 0) index = 0; // 1 月 1 日恰逢主日时，周一为第 1 篇
  const week = Math.floor(index / 6) + 1;
  const day = (index % 6) + 1;
  const dateKey = formatDateKey(current);
  const dateLabel = `${current.getFullYear()} 年 ${current.getMonth() + 1} 月 ${current.getDate()} 日`;
  return { week, day, dateKey, dateLabel, isRestDay };
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
  if (schedule.isRestDay) return "rest"; // 主日休息，不安排灵修
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
        <span className="devotion-table-hint">← 左右滑动查看完整表格 →</span>
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

function ReadingSection({ blocks, label }: { blocks: ReadingBlock[]; label: string }) {
  if (blocks.length === 0) return null;

  return (
    <section className="reading-section">
      <div className="reading-section-heading">
        <span>{label}</span>
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
  const [fontSize, setFontSize] = useState(() => {
    // 旧默认（≤21px）统一提升到新默认 23px，解决阅读费眼
    const stored = readStored<number>(STORAGE.fontSize, 23);
    return clampFontSize(stored <= 21 ? 23 : stored);
  });
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
    // 主日休息 / 超过 52 周计划之外：不加载篇目，显示复习与祷告日
    if (schedule.isRestDay || schedule.week > TOTAL_WEEKS) {
      setReadingState({ key: readingKey, reading: null, status: "ready" });
      return () => controller.abort();
    }
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
  }, [readingKey, schedule.day, schedule.week, schedule.isRestDay]);

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

  return (
    <main className="devotion-page">
      <section className="today-intro" id="today">
        <p className="eyebrow">TODAY&apos;S DEVOTION · {schedule.dateLabel}</p>
        <div className="intro-content">
          <div>
            <p className="week-label">
              {isTodaySelected ? "今天" : "补读"} · 第 {schedule.week} 周 · 第 {schedule.day} 日
              {schedule.isRestDay ? " · 主日休息" : ""}
            </p>
            <h1>{isLoading ? "正在打开今天的灵修…" : reading?.title ?? (schedule.isRestDay ? "主日 · 休息与祷告" : "复习与祷告日")}</h1>
            <p className="intro-copy">年度计划从每年 1 月 1 日开始，每周读 6 天、主日休息。打开先看今天，也可以从日历补上过去没有完成的灵修。</p>
          </div>
          <div className="host-card">
            <span>本周主持人</span>
            <b>待公布</b>
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
            {currentDayState === "rest" && "主日休息：不安排灵修，愿你在敬拜中得安息。"}
            {currentDayState === "done" && "这一天已完成，可继续复习或查看记录。"}
            {currentDayState === "skipped" && "这一天已记为未领修，不计入待补提醒。"}
            {currentDayState === "missed" && "这一天还没有完成，建议今天补读后再进入今日内容。"}
            {currentDayState === "open" && `建议阅读第 ${schedule.week} 周第 ${schedule.day} 日${reading?.scripture ? `：${reading.scripture}` : "。"}`}
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
                  <small>{state === "done" ? "✓" : state === "rest" ? "休" : state === "skipped" ? "停" : state === "missed" ? "补" : ""}</small>
                </button>
              );
            })}
          </div>
          <div className="calendar-legend">
            <span><i className="legend-done"></i>已完成</span>
            <span><i className="legend-missed"></i>待补</span>
            <span><i className="legend-skipped"></i>未领修</span>
            <span><i className="legend-rest"></i>主日休息</span>
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
                <div className="scripture-row">
                  <span>今日经文</span>
                  {(() => {
                    const ref = scriptureRef(reading.scripture);
                    return ref ? (
                      <a className="scripture-ref-link" href={`${BIBLE_READER_URL}?ref=${encodeURIComponent(ref)}`} target="_blank" rel="noreferrer">
                        {reading.scripture}
                      </a>
                    ) : (
                      <b>{reading.scripture}</b>
                    );
                  })()}
                </div>
                <div className="bible-actions">
                  <button type="button" onClick={() => completeStep(1)}>我已读完经文</button>
                </div>
              </header>
              <div className="reading-body">
                <ReadingSection blocks={reading.sections.summary} label="第一段 · 摘要" />
                <ReadingSection blocks={reading.sections.thought} label="第二段 · 默想" />
                <ReadingSection blocks={reading.sections.practice} label="第三段 · 与主同行" />
              </div>
              <div className="reading-complete">
                <span>读完原文后，带着所领受的进入分享。</span>
                <button type="button" className="primary-button" onClick={() => completeStep(2)}>{completedSteps.includes(2) ? "已完成阅读 ✓" : "完成今日阅读"}</button>
              </div>
              {reading.keyVerse && (
                <section className="key-verse-card">
                  <p className="eyebrow">TODAY&apos;S KEY VERSE · 今日金句</p>
                  <h3>今日金句</h3>
                  <a
                    className="key-verse-link"
                    href={`${BIBLE_READER_URL}?ref=${encodeURIComponent(reading.keyVerse)}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="在圣经阅读器中打开今日金句"
                  >
                    {reading.keyVerse}
                  </a>
                </section>
              )}
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

          <section className="prayer-card">
            <div><p className="eyebrow">PRAY TOGETHER</p><h2>代祷事项</h2><p>将每个人的需要带到主面前；这些文字只保存在你的这台设备。</p></div>
            <div>
              <textarea value={journal.prayer} onChange={(event) => updateJournal("prayer", event.target.value)} placeholder="例如：为家人、工作、健康、福音对象祷告…" />
              <button type="button" className="primary-button" onClick={() => completeStep(5)}>交托并结束祷告</button>
            </div>
          </section>
        </div>
      </section>

      <footer className="devotion-credit" aria-label="版权与致谢">
        <p className="devotion-credit-title">致谢与版权声明</p>
        <p>
          本站每日灵修内容节录自 <b>苏颖智《每日与主同行》</b>（原书，下称「原书」）。
          <b>《每日与主同行》之全部著作权及邻接权利归作者苏颖智及其出版单位所有。</b>
        </p>
        <p>
          本站所载内容仅为信徒个人灵修、查经及教会内部学习交流之非商业用途，本站不就原书内容主张任何权利，
          亦不构成对原书权利的转让或授权。未经原著作权人书面许可，请勿将本站内容用于任何商业或公开发行用途。
        </p>
        <p>
          如您认为本站内容存在权利争议，或希望删除相关内容，请与本站联系，我们将在核实后及时处理。
          资料来源：WellsOfGrace.com。
        </p>
      </footer>
    </main>
  );
}
