"use client";

import { useState } from "react";
import { submitCareMessage } from "../lib/api";

const CATEGORIES = ["人際關係", "家庭", "子女教育", "信仰疑問", "情緒壓力", "其他"];

// 爱心窗口：匿名诉说表单。提交成功存 D1（教会后台处理/远程辅导）；
// 后台未配置或网络失败时，暂存 localStorage（待教会导出），并提示可稍后重试。
export default function CareForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [content, setContent] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "local">("idle");
  const [msg, setMsg] = useState("");

  const canSubmit = content.trim().length > 0 && state !== "sending";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setState("sending");
    const payload = { name, contact, category, content: content.trim() };
    const res = await submitCareMessage(payload);
    if (res.ok) {
      setState("ok");
      setMsg("已收到你的傾訴，教會不會公開。教會同工會盡快與你聯繫（如需遠程輔導，請留下聯繫方式）。願神的平安與你同在。");
      return;
    }
    // 兜底：暂存本机，待教会导出/稍后重试
    try {
      const saved = JSON.parse(localStorage.getItem("rehoboth-care-drafts") ?? "[]");
      saved.push({ ...payload, savedAt: new Date().toISOString() });
      localStorage.setItem("rehoboth-care-drafts", JSON.stringify(saved));
    } catch {
      /* ignore */
    }
    setState("local");
    setMsg("暫時無法連上後台，你的傾訴已保存到本機（教會同工可協助導出）。你也可以稍後重試，或直接聯繫教會同工。");
  }

  if (state === "ok" || state === "local") {
    return (
      <div className="site-form-done">
        <p className="site-form-done-icon" aria-hidden="true">✉</p>
        <h3>{state === "ok" ? "已收到" : "已保存到本機"}</h3>
        <p>{msg}</p>
        <button className="site-btn-ghost" onClick={() => { setState("idle"); setContent(""); setMsg(""); }}>再寫一條</button>
      </div>
    );
  }

  return (
    <form className="site-form" onSubmit={onSubmit}>
      <label>
        <span>稱呼（可匿名）</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="匿名" maxLength={40} />
      </label>
      <label>
        <span>聯繫方式（選填，供教會遠程輔導聯繫）</span>
        <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="微信 / 郵箱 / 電話" maxLength={120} />
      </label>
      <label>
        <span>類別</span>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </label>
      <label>
        <span>想說的話</span>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={6} maxLength={4000} placeholder="請放心傾訴，教會會以溫柔與保密的心聆聽…" />
      </label>
      <p className="site-form-note">＊ 內容僅教會同工可見，不會公開。提交即表示你同意教會同工閱覽並（在你留下聯繫方式時）聯繫你。</p>
      <button className="site-btn-primary" type="submit" disabled={!canSubmit}>
        {state === "sending" ? "送出中…" : "送出傾訴"}
      </button>
    </form>
  );
}
