"use client";

import { useState } from "react";
import { submitMembership } from "../lib/api";

const INTENTS = ["想了解信仰", "想参加聚会", "想加入教会", "只是想先认识教会"];

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
      setMsg("欢迎你！教会同工会尽快与你联系。愿你在利河伯找到安息与归属。");
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
    setMsg("暂时无法连上后台，你的意愿已保存到本机（教会同工可协助导出）。你也可以稍后重试，或直接到教会找接待同工。");
  }

  if (state === "ok" || state === "local") {
    return (
      <div className="site-form-done">
        <p className="site-form-done-icon" aria-hidden="true">♥</p>
        <h3>{state === "ok" ? "欢迎你" : "已保存到本机"}</h3>
        <p>{msg}</p>
      </div>
    );
  }

  return (
    <form className="site-form" onSubmit={onSubmit}>
      <label>
        <span>称呼</span>
        <input value={name} onChange={(e) => setName(e.target.value)} maxLength={40} placeholder="怎么称呼你？" />
      </label>
      <label>
        <span>联系方式</span>
        <input value={contact} onChange={(e) => setContact(e.target.value)} maxLength={120} placeholder="微信 / 邮箱 / 电话" />
      </label>
      <label>
        <span>你的心愿</span>
        <select value={intent} onChange={(e) => setIntent(e.target.value)}>
          {INTENTS.map((i) => <option key={i} value={i}>{i}</option>)}
        </select>
      </label>
      <label>
        <span>想说的话（选填）</span>
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={4} maxLength={4000} placeholder="任何想让教会知道的…" />
      </label>
      <button className="site-btn-primary" type="submit" disabled={state === "sending"}>
        {state === "sending" ? "送出中…" : "送出"}
      </button>
    </form>
  );
}
