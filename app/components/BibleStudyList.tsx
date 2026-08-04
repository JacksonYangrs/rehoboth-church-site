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
        <p>正在载入查经公告…</p>
      </div>
    );
  }

  if (list.length === 0) {
    return (
      <div className="site-feed-empty site-feed-empty--bs">
        <svg className="site-feed-empty-icon" viewBox="0 0 48 48" width="46" height="46" fill="none" stroke="#205088" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M24 10c-4.5-2.6-10-3-14-1.8V38c4-1.2 9.5-.8 14 1.8 4.5-2.6 10-3 14-1.8V8.2C34 7 28.5 7.4 24 10z" />
          <path d="M24 10v29.8" />
          <path d="M12 25h6M12 30h6M30 25h6M30 30h6" />
        </svg>
        <p>新的查经计划准备中。请稍后回来，我们会在每周查经前于此公布时间、地点与查考经文。</p>
      </div>
    );
  }

  const [current, ...history] = list;
  const when = current.time ? `${current.date}（周五）· ${current.time}` : `${current.date}（周五）`;
  return (
    <div className="site-feed">
      <article className="site-bs-current">
        <p className="eyebrow">本周查经 · {current.week}</p>
        <h3>{current.topic}</h3>
        <dl>
          <div><dt>时间</dt><dd>{when}</dd></div>
          <div><dt>地点</dt><dd>{current.venue || "线上 Zoom（连结见下）"}</dd></div>
          {current.passage ? <div><dt>查经经文</dt><dd>{current.passage}</dd></div> : null}
          {current.leader ? <div><dt>主持人</dt><dd>{current.leader}</dd></div> : null}
          {current.notes ? <div><dt>备注</dt><dd>{current.notes}</dd></div> : null}
        </dl>
        {current.zoomUrl ? (
          <a className="site-btn-primary" href={current.zoomUrl} target="_blank" rel="noreferrer">加入 Zoom 查经</a>
        ) : null}
      </article>

      {history.length > 0 ? (
        <div className="site-bs-history">
          <h4>往期查经</h4>
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
