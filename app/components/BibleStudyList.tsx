"use client";

import { useEffect, useState } from "react";
import { getBibleStudies, type BibleStudyItem } from "../lib/api";

// 查经公告：最新一条为「本周公告」大卡，其余为历史列表。
// 查经计划字段：时间（date + time）、地点（venue / Zoom）、主持人（leader）、查经经文（passage）。
export default function BibleStudyList() {
  const [list, setList] = useState<BibleStudyItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    getBibleStudies().then((data) => {
      if (alive) setList(data);
    });
    return () => {
      alive = false;
    };
  }, []);

  if (list === null) {
    return (
      <div className="site-feed-empty">
        <span className="site-feed-spinner" aria-hidden="true" />
        <p>正在載入查經公告…</p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="site-feed-empty">
        <p>📖 新的查經計劃準備中。請稍後回來，我們會在每週查經前於此公布時間、地點與查考經文。</p>
      </div>
    );
  }

  const [current, ...history] = list;
  const when = current.time ? `${current.date}（週五）· ${current.time}` : `${current.date}（週五）`;
  return (
    <div className="site-feed">
      <article className="site-bs-current">
        <p className="eyebrow">本週查經 · {current.week}</p>
        <h3>{current.topic}</h3>
        <dl>
          <div><dt>時間</dt><dd>{when}</dd></div>
          <div><dt>地點</dt><dd>{current.venue || "線上 Zoom（連結見下）"}</dd></div>
          {current.passage ? <div><dt>查經經文</dt><dd>{current.passage}</dd></div> : null}
          {current.leader ? <div><dt>主持人</dt><dd>{current.leader}</dd></div> : null}
          {current.notes ? <div><dt>備註</dt><dd>{current.notes}</dd></div> : null}
        </dl>
        {current.zoomUrl ? (
          <a className="site-btn-primary" href={current.zoomUrl} target="_blank" rel="noreferrer">加入 Zoom 查經</a>
        ) : null}
      </article>

      {history.length > 0 ? (
        <div className="site-bs-history">
          <h4>往期查經</h4>
          {history.map((item) => (
            <article className="site-bs-row" key={item.id}>
              <time>{item.date}{item.time ? ` ${item.time}` : ""}</time>
              <b>{item.topic}</b>
              <span>{item.passage}</span>
              {item.leader ? <small>主持：{item.leader}</small> : null}
            </article>
          ))}
        </div>
      ) : null}
    </div>
  );
}
