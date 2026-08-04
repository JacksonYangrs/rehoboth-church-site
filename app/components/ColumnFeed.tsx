"use client";

import { useEffect, useState } from "react";
import { getPosts, type PostItem } from "../lib/api";

// 专栏活动记录流：从公开 API 拉取某栏目的活动记录（照片/视频/文字），
// API 未配置或暂无记录时显示空态。
export default function ColumnFeed({ columnSlug, emptyText }: { columnSlug: string; emptyText: string }) {
  const [posts, setPosts] = useState<PostItem[] | null>(null);

  useEffect(() => {
    let alive = true;
    getPosts(columnSlug).then((data) => {
      if (alive) setPosts(data);
    });
    return () => {
      alive = false;
    };
  }, [columnSlug]);

  if (posts === null) {
    return (
      <div className="site-feed-empty">
        <span className="site-feed-spinner" aria-hidden="true" />
        <p>正在载入活动记录…</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="site-feed-empty">
        <p>📷 {emptyText}</p>
      </div>
    );
  }

  return (
    <div className="site-feed">
      {posts.map((post) => (
        <article className="site-feed-item" key={post.id}>
          <header className="site-feed-head">
            <time>{post.date}</time>
            <h3>{post.title}</h3>
          </header>
          {post.content ? <p className="site-feed-content">{post.content}</p> : null}
          {post.media.length > 0 ? (
            <div className="site-feed-media">
              {post.media.map((m) =>
                m.kind === "video" ? (
                  <video key={m.id} controls preload="metadata" poster={post.cover || undefined} className="site-feed-video">
                    <source src={m.url} />
                    你的浏览器不支援影片播放。
                  </video>
                ) : (
                  <figure key={m.id} className="site-feed-photo">
                    <img src={m.url} alt={m.caption || post.title} loading="lazy" />
                    {m.caption ? <figcaption>{m.caption}</figcaption> : null}
                  </figure>
                ),
              )}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  );
}
