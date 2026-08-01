"use client";

import { useState } from "react";
import { submitMembership } from "../lib/api";

const INTENTS = ["想了解信仰", "想參加聚會", "想加入教會", "只是想先認識教會"];

// 会员接纳：面向非基督徒/新朋友的线上窗口。
// 提交成功存 D1（教会后台处理）；后台未配置或失败时暂存 localStorage 兜底。
export default function MembershipForm() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [intent, setIntent] = useState(INTENTS[0]);
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "local">("idle");
  const [msg, setMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    const payload = { name, contact, intent, message: message.trim() };
    const res = await submitMembership(payload);
    if (res.ok) {
      setState("ok");
      setMsg("歡迎你！教會同工會盡快與你聯繫。願你在利河伯找到安息與歸屬。");
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem("rehoboth-membership-drafts") ?? "[]");
      saved.push({ ...payload, savedAt: new Date().toISOString() });
      localStorage.setItem("rehoboth-membership-drafts", JSON.stringify(saved));
    } catch {
      /* ignore */
    }
    setState("local");
    setMsg("暫時無法連上後台，你的意願已保存到本機（教會同工可協助導出）。你也可以稍後重試，或直接到教會找接待同工。");
  }

  if (state === "ok" || state === "local") {
    return (
      <div className="site-form-done">
        <p className="site-form-done-icon" aria-hidden="true">♥</p>
        <h3>{state === "ok" ? "歡迎你" : "已保存到本機"}</h3>
        <p>{msg}</p>
      </div>
    );
  }

  return (
    <form className="site-form" onSubmit={onSubmit}>
      <label>
        <span>稱呼</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="怎麼稱呼你？" />
      </label>
      <label>
        <span>聯繫方式</span>
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} placeholder="微信 / 郵箱 / 電話" />
      </label>
      <label>
        <span>你的心願</span>
        <select value={intent} onChange={(e) => setIntent(e.target.value)}>
          {INTENTS.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </label>
      <label>
        <span>想說的話（選填）</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={4000} placeholder="任何想讓教會知道的…" />
      </label>
      <button className="site-btn-primary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "送出中…" : "送出"}
      </button>
    </form>
  );
}
