"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const SOURCE_URL =
  "https://raw.githubusercontent.com/JacksonYangrs/bible-cuv-phonetic/main/index.html";

type BibleBook = {
  t: string;
  ts: string;
  cs: string[][];
  css: string[][];
};

type Lexicon = {
  RPMAP: Record<string, string>;
  EXTRA: Record<string, string>;
  RPMAP_S: Record<string, string>;
  EXTRA_S: Record<string, string>;
  SIMP2TRAD: Record<string, string>;
  DEFS: Record<string, string>;
};

type BibleData = { books: BibleBook[]; lexicon: Lexicon };
type Language = "trad" | "simp";
type PageItem =
  | { kind: "book"; book: number }
  | { kind: "chapter"; book: number; chapter: number }
  | {
      kind: "verse";
      book: number;
      chapter: number;
      verse: number;
      text: string;
      continuation: boolean;
    };
type Layout = {
  pages: PageItem[][];
  chapterPages: Record<string, number>;
  labels: string[];
};
type Tip = { char: string; pinyin: string; meaning?: string; x: number; y: number };

const seedData: BibleData = {
  books: [
    {
      t: "創世記",
      ts: "创世记",
      cs: [["起初，神創造天地。", "地是空虛混沌，淵面黑暗；神的靈運行在水面上。", "神說：要有光，就有了光。"]],
      css: [["起初，神创造天地。", "地是空虚混沌，渊面黑暗；神的灵运行在水面上。", "神说：要有光，就有了光。"]],
    },
    {
      t: "約翰福音",
      ts: "约翰福音",
      cs: [["太初有道，道與神同在，道就是神。", "這道太初與神同在。", "萬物是藉著他造的；凡被造的，沒有一樣不是藉著他造的。"]],
      css: [["太初有道，道与神同在，道就是神。", "这道太初与神同在。", "万物是藉著他造的；凡被造的，没有一样不是藉著他造的。"]],
    },
  ],
  lexicon: {
    RPMAP: { 淵: "yuān", 靈: "líng", 藉: "jiè" },
    EXTRA: {},
    RPMAP_S: { 渊: "yuān", 灵: "líng", 借: "jiè" },
    EXTRA_S: {},
    SIMP2TRAD: { 渊: "淵", 灵: "靈", 借: "藉" },
    DEFS: { 淵: "深水、深潭", 靈: "灵；神的灵", 藉: "凭借、通过" },
  },
};

function extractObject(source: string, name: string) {
  const marker = `const ${name} = `;
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) throw new Error(`找不到 ${name}`);
  const start = source.indexOf("{", markerIndex + marker.length);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'") quote = char;
    else if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return JSON.parse(source.slice(start, index + 1));
    }
  }
  throw new Error(`无法读取 ${name}`);
}

function splitVerse(text: string, limit = 88) {
  const chars = Array.from(text);
  if (chars.length <= limit) return [text];
  const result: string[] = [];
  for (let cursor = 0; cursor < chars.length; cursor += limit) {
    result.push(chars.slice(cursor, cursor + limit).join(""));
  }
  return result;
}

function paginate(data: BibleData, language: Language, includeCommon: boolean): Layout {
  const pages: PageItem[][] = [];
  const chapterPages: Record<string, number> = {};
  const labels: string[] = [];
  const limit = includeCommon ? 142 : 164;
  let current: PageItem[] = [];
  let weight = 0;
  let verses = 0;
  let currentLabel = "";
  const flush = () => {
    if (current.length) {
      pages.push(current);
      labels.push(currentLabel);
      current = [];
      weight = 0;
      verses = 0;
    }
  };

  data.books.forEach((book, bookIndex) => {
    const title = language === "trad" ? book.t : book.ts;
    flush();
    currentLabel = title;
    current.push({ kind: "book", book: bookIndex });
    weight = 32;
    book.cs.forEach((chapter, chapterIndex) => {
      flush();
      currentLabel = `${title} · ${chapterIndex + 1}章`;
      chapterPages[`${bookIndex}-${chapterIndex}`] = pages.length;
      current.push({ kind: "chapter", book: bookIndex, chapter: chapterIndex });
      weight = 34;
      const versesInLanguage = language === "trad" ? chapter : book.css[chapterIndex];
      versesInLanguage.forEach((verseText, verseIndex) => {
        splitVerse(verseText).forEach((segment, segmentIndex) => {
          const segmentWeight = Array.from(segment).length;
          if (current.length > 1 && (weight + segmentWeight > limit || verses >= 4)) flush();
          current.push({
            kind: "verse",
            book: bookIndex,
            chapter: chapterIndex,
            verse: verseIndex,
            text: segment,
            continuation: segmentIndex > 0,
          });
          weight += segmentWeight;
          verses += 1;
        });
      });
    });
  });
  flush();
  return { pages, chapterPages, labels };
}

function useIsCompact() {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const sync = () => setCompact(window.innerWidth < 760);
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, []);
  return compact;
}

export default function Home() {
  const [data, setData] = useState<BibleData>(seedData);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  const [language, setLanguage] = useState<Language>("trad");
  const [includeCommon, setIncludeCommon] = useState(false);
  const [known, setKnown] = useState<Set<string>>(new Set());
  const [page, setPage] = useState(0);
  const [tocOpen, setTocOpen] = useState(false);
  const [openBook, setOpenBook] = useState<number | null>(0);
  const [direction, setDirection] = useState<"next" | "prev">("next");
  const [tip, setTip] = useState<Tip | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [layoutRevision, setLayoutRevision] = useState(0);
  const compact = useIsCompact();

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem("cuv-language");
    const savedKnown = window.localStorage.getItem("cuv-known");
    setLanguage(savedLanguage === "simp" ? "simp" : "trad");
    setIncludeCommon(window.localStorage.getItem("cuv-common-pinyin") === "1");
    if (savedKnown) setKnown(new Set(JSON.parse(savedKnown)));
  }, []);

  useEffect(() => {
    let active = true;
    fetch(SOURCE_URL)
      .then((response) => {
        if (!response.ok) throw new Error("经文源暂不可用");
        return response.text();
      })
      .then((source) => {
        if (!active) return;
        const remote = extractObject(source, "DATA") as { books: BibleBook[] };
        const lexicon = {
          RPMAP: extractObject(source, "RPMAP"),
          EXTRA: extractObject(source, "EXTRA"),
          RPMAP_S: extractObject(source, "RPMAP_S"),
          EXTRA_S: extractObject(source, "EXTRA_S"),
          SIMP2TRAD: extractObject(source, "SIMP2TRAD"),
          DEFS: extractObject(source, "DEFS"),
        } as Lexicon;
        setData({ books: remote.books, lexicon });
        setStatus("ready");
      })
      .catch(() => active && setStatus("fallback"));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const onFullscreen = () => {
      setFullscreen(Boolean(document.fullscreenElement));
      setLayoutRevision((value) => value + 1);
    };
    const onResize = () => setLayoutRevision((value) => value + 1);
    document.addEventListener("fullscreenchange", onFullscreen);
    window.addEventListener("resize", onResize);
    return () => {
      document.removeEventListener("fullscreenchange", onFullscreen);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const layout = useMemo(
    () => paginate(data, language, includeCommon),
    [data, language, includeCommon, layoutRevision],
  );
  const step = compact ? 1 : 2;
  const visiblePages = compact ? [page] : [page, page + 1];
  const maxPage = Math.max(0, layout.pages.length - 1);
  const shownCount = compact ? layout.pages.length : Math.ceil(layout.pages.length / 2);
  const shownPage = compact ? page + 1 : Math.floor(page / 2) + 1;

  useEffect(() => setPage((current) => Math.min(current, maxPage)), [maxPage]);

  const pinyinFor = useCallback(
    (char: string) => {
      const lexicon = language === "trad" ? data.lexicon.RPMAP : data.lexicon.RPMAP_S;
      const additional = language === "trad" ? data.lexicon.EXTRA : data.lexicon.EXTRA_S;
      return lexicon[char] || (includeCommon ? additional[char] : "");
    },
    [data.lexicon, includeCommon, language],
  );

  const canonical = useCallback(
    (char: string) => (language === "simp" ? data.lexicon.SIMP2TRAD[char] || char : char),
    [data.lexicon.SIMP2TRAD, language],
  );

  const move = useCallback(
    (nextDirection: "next" | "prev") => {
      setDirection(nextDirection);
      setTip(null);
      setPage((current) =>
        nextDirection === "next"
          ? Math.min(maxPage, current + step)
          : Math.max(0, current - step),
      );
    },
    [maxPage, step],
  );

  const jumpTo = (book: number, chapter: number) => {
    const target = layout.chapterPages[`${book}-${chapter}`] || 0;
    setDirection("next");
    setPage(compact ? target : target - (target % 2));
    setTocOpen(false);
    setTip(null);
  };

  const recognize = (char: string) => {
    const key = canonical(char);
    setKnown((previous) => {
      const next = new Set(previous);
      next.add(key);
      window.localStorage.setItem("cuv-known", JSON.stringify([...next]));
      return next;
    });
    setLayoutRevision((value) => value + 1);
    setTip(null);
  };

  const showTipAfterDelay = (event: React.MouseEvent<HTMLElement>, char: string, pinyin: string) => {
    const element = event.currentTarget;
    const timer = window.setTimeout(() => {
      const bounds = element.getBoundingClientRect();
      setTip({
        char,
        pinyin,
        meaning: data.lexicon.DEFS[char] || data.lexicon.DEFS[canonical(char)],
        x: Math.max(14, Math.min(window.innerWidth - 246, bounds.left - 52)),
        y: Math.max(80, bounds.top - 68),
      });
    }, 3000);
    element.dataset.tipTimer = String(timer);
  };

  const clearTip = (event?: React.SyntheticEvent<HTMLElement>) => {
    if (event) {
      const timer = Number(event.currentTarget.dataset.tipTimer);
      if (timer) window.clearTimeout(timer);
    }
    setTip(null);
  };

  const renderText = (text: string) =>
    Array.from(text).map((char, index) => {
      const pinyin = pinyinFor(char);
      const isKnown = known.has(canonical(char));
      if (!pinyin || isKnown) return <span key={`${char}-${index}`}>{char}</span>;
      return (
        <ruby
          key={`${char}-${index}`}
          className="annotated-char"
          onClick={(event) => {
            event.stopPropagation();
            recognize(char);
          }}
          onMouseEnter={(event) => showTipAfterDelay(event, char, pinyin)}
          onMouseLeave={clearTip}
          onTouchStart={(event) => showTipAfterDelay(event, char, pinyin)}
          onTouchEnd={clearTip}
          title="轻点标记为已识；停留 3 秒查看释义"
        >
          {char}<rt>{pinyin}</rt>
        </ruby>
      );
    });

  const renderPage = (pageItems: PageItem[] | undefined, pageIndex: number) => {
    if (!pageItems) return <article className="paper-page empty-page" aria-hidden="true" />;
    return (
      <article className={`paper-page ${direction === "next" ? "turn-next" : "turn-prev"}`} key={`${pageIndex}-${layoutRevision}`}>
        <div className="paper-grain" />
        <div className="page-content">
          {pageItems.map((item, index) => {
            if (item.kind === "book") {
              const book = data.books[item.book];
              return <h1 className="book-title" key={`${item.kind}-${index}`}>{language === "trad" ? book.t : book.ts}</h1>;
            }
            if (item.kind === "chapter") {
              return <h2 className="chapter-title" key={`${item.kind}-${index}`}>第 {item.chapter + 1} 章</h2>;
            }
            return (
              <p className={`verse ${item.continuation ? "continued" : ""}`} key={`${item.book}-${item.chapter}-${item.verse}-${index}`}>
                {!item.continuation && <sup>{item.verse + 1}</sup>}
                {renderText(item.text)}
              </p>
            );
          })}
        </div>
        <footer className="paper-footer">{pageIndex + 1}</footer>
      </article>
    );
  };

  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight" || event.key === "PageDown") move("next");
      if (event.key === "ArrowLeft" || event.key === "PageUp") move("prev");
      if (event.key === "Escape") setTocOpen(false);
    };
    window.addEventListener("keydown", keydown);
    return () => window.removeEventListener("keydown", keydown);
  }, [move]);

  return (
    <main className="reader-shell">
      <header className="reader-header">
        <button className="control primary-control" onClick={() => setTocOpen(true)}>☰ <span>目录</span></button>
        <div className="brand-lockup">
          <span className="brand-kicker">CHINESE UNION VERSION</span>
          <strong>聖經 · 和合本</strong>
        </div>
        <div className="header-spacer" />
        <span className={`layout-status ${status}`}>{status === "loading" ? "正在载入全书…" : status === "ready" ? "全书预排已就绪" : "示例经文模式"}</span>
        <button className={`control ${includeCommon ? "active" : ""}`} onClick={() => { setIncludeCommon((value) => { window.localStorage.setItem("cuv-common-pinyin", value ? "0" : "1"); return !value; }); setLayoutRevision((value) => value + 1); }}>
          <span className="desktop-only">常用字</span>{includeCommon ? "注音开" : "注音关"}
        </button>
        <button className="control" onClick={() => { const next = language === "trad" ? "simp" : "trad"; window.localStorage.setItem("cuv-language", next); setLanguage(next); setLayoutRevision((value) => value + 1); }}>
          {language === "trad" ? "繁" : "简"}
        </button>
        <button className="control fullscreen-control" onClick={() => document.fullscreenElement ? document.exitFullscreen() : document.documentElement.requestFullscreen()}>
          {fullscreen ? "退出全屏" : "全屏"}
        </button>
      </header>

      <section className="reader-stage" onClick={() => clearTip()} aria-label="圣经阅读区">
        <button className="page-hotspot previous-hotspot" aria-label="上一页" onClick={(event) => { event.stopPropagation(); move("prev"); }} />
        <div className={`book-spread ${compact ? "single" : "double"}`}>
          {visiblePages.map((pageNumber) => renderPage(layout.pages[pageNumber], pageNumber))}
        </div>
        <button className="page-hotspot next-hotspot" aria-label="下一页" onClick={(event) => { event.stopPropagation(); move("next"); }} />
      </section>

      <footer className="reader-footer">
        <button className="round-control" onClick={() => move("prev")} aria-label="上一页">‹</button>
        <div className="page-readout">
          <b>{shownPage}</b><span> / {shownCount}</span>
          <small>{layout.labels[Math.min(page, layout.labels.length - 1)] || "正在预排…"}</small>
        </div>
        <button className="round-control" onClick={() => move("next")} aria-label="下一页">›</button>
        <button className="known-control" onClick={() => {
          if (known.size && window.confirm(language === "trad" ? "要恢复所有已识字的拼音吗？" : "要恢复所有已识字的拼音吗？")) {
            setKnown(new Set()); window.localStorage.removeItem("cuv-known"); setLayoutRevision((value) => value + 1);
          }
        }}>
          已识 {known.size}
        </button>
      </footer>

      {tip && <aside className="character-tip" style={{ left: tip.x, top: tip.y }} role="status"><b>{tip.char}</b><span>{tip.pinyin}</span><em>{tip.meaning || "点击可标记为已识"}</em></aside>}

      {tocOpen && (
        <div className="toc-layer" role="dialog" aria-modal="true" aria-label="圣经目录">
          <button className="toc-mask" aria-label="关闭目录" onClick={() => setTocOpen(false)} />
          <aside className="toc-panel">
            <div className="toc-heading"><div><small>CHINESE UNION VERSION</small><h2>书卷目录</h2></div><button onClick={() => setTocOpen(false)} aria-label="关闭目录">×</button></div>
            <div className="toc-scroll">
              {[{ title: language === "trad" ? "旧约" : "旧约", from: 0, to: 39 }, { title: language === "trad" ? "新约" : "新约", from: 39, to: data.books.length }].map((testament) => (
                <section className="testament" key={testament.title}>
                  <h3>{testament.title}</h3>
                  {data.books.slice(testament.from, testament.to).map((book, offset) => {
                    const bookIndex = testament.from + offset;
                    const opened = openBook === bookIndex;
                    const chapterCount = book.cs.length;
                    return <div className="toc-book" key={`${book.t}-${bookIndex}`}>
                      <button className="toc-book-button" onClick={() => setOpenBook(opened ? null : bookIndex)}><span><i>{bookIndex + 1}</i>{language === "trad" ? book.t : book.ts}</span><b>{opened ? "−" : "+"}</b></button>
                      {opened && <div className="chapter-grid">{Array.from({ length: chapterCount }, (_, chapter) => <button key={chapter} onClick={() => jumpTo(bookIndex, chapter)}>{chapter + 1}</button>)}</div>}
                    </div>;
                  })}
                </section>
              ))}
            </div>
          </aside>
        </div>
      )}
    </main>
  );
}
