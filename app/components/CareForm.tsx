"use client";

import { useState } from "react";
import { submitCareMessage } from "../lib/api";

// 爱心窗口：右侧单一倾诉输入框（极简）。
// 提交成功存 D1（教会后台处理/远程辅导）；后台未配置或失败时暂存 localStorage 兜底。
export default function CareForm() {
  const [contact, setContact] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "local">("idle");
  const [msg, setMsg] = useState("");

  const canSubmit = content.trim().length > 0 && state !== "sending";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setState("sending");
    const payload = { name: "", contact, category: "其他", content: content.trim() };
    const res = await submitCareMessage(payload);
    if (res.ok) {
      setState("ok");
      setMsg("已收到你的倾诉，教会不会公开。教会同工会尽快与你联系（如需远程辅导，请留下联系方式）。愿神的平安与你同在。");
      return;
    }
    try {
      const saved = JSON.parse(localStorage.getItem("rehoboth-care-drafts") ?? "[]");
      saved.push({ ...payload, savedAt: new Date().toISOString() });
      localStorage.setItem("rehoboth-care-drafts", JSON.stringify(saved));
    } catch {
      /* ignore */
    }
    setState("local");
    setMsg("暂时无法连上后台，你的倾诉已保存到本机（教会同工可协助导出）。你也可以稍后重试，或直接联系教会同工。");
  }

  if (state === "ok" || state === "local") {
    return (
      <div className="site-form-done">
        <p className="site-form-done-icon" aria-hidden="true">✉</p>
        <h3>{state === "ok" ? "已收到" : "已保存到本机"}</h3>
        <p>{msg}</p>
        <button className="site-btn-ghost" onClick={() => { setState("idle"); setContent(""); setMsg(""); }}>再写一条</button>
      </div>
    );
  }

  return (
    <form className="site-form site-form--care" onSubmit={onSubmit}>
      <label>
        <span>想说的话</span>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={9} maxLength={4000} placeholder="请放心倾诉，教会会以温柔与保密的心聆听…" />
      </label>
      <label>
        <span>联系方式（选填，供教会远程辅导联系）</span>
        <input value={contact} onChange={(e) => setContact(e.target.value)} placeholder="微信 / 邮箱 / 电话" maxLength={120} />
      </label>
      <p className="site-form-note">＊ 内容仅教会同工可见，不会公开。提交即表示你同意教会同工阅览并（在你留下联系方式时）联系你。</p>
      <button className="site-btn-primary" type="submit" disabled={!canSubmit}>
        {state === "sending" ? "送出中…" : "送出倾诉"}
      </button>
    </form>
  );
}
