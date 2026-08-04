import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "线上奉献指南 · 利河伯教会" };

// 银行账户信息（2026-08 由教会确认）
// 字段：账户名称 / 开户银行 / 银行账号 / SWIFT / 币种
// 留空字段显示「待教會確認」。
const ACCOUNT = {
  name: "REHOBOTH CHURCH INC.",
  bank: "UNION BANK",
  number: "001900004401",
  swift: "",
  currency: "",
};

export default function Page() {
  const rows: { label: string; value: string; accent?: boolean }[] = [
    { label: "账户名称", value: ACCOUNT.name || "待教会确认" },
    { label: "开户银行", value: ACCOUNT.bank || "待教会确认" },
    { label: "银行账号", value: ACCOUNT.number || "待教会确认", accent: true },
    { label: "SWIFT / BIC", value: ACCOUNT.swift || "待教会确认" },
    { label: "币种", value: ACCOUNT.currency || "待教会确认" },
  ];

  return (
    <main className="site-page">
      <header className="site-hero site-hero--column" style={{ backgroundImage: "url(/giving-box.png)" }}>
        <div className="site-hero-overlay" />
        <div className="site-hero-inner">
          <p className="eyebrow-light">GIVING · 线上奉献指南</p>
          <h1>线上奉献指南</h1>
          <VerseQuote verse={VERSE_COLUMNS.giving} />
          <p className="site-hero-copy">你的奉献支持教会的日常事工、建堂与各项关怀服侍。捐得乐意的人，是神所喜爱的。</p>
        </div>
      </header>

      <section className="site-page-body">
        <div className="site-giving">
          <p className="site-giving-note">
            奉献可分为：<b>日常奉献</b>（教会经常费）、<b>建堂奉献</b>（建堂专款）与
            <b>特别事工奉献</b>。汇款时请注明用途，若有疑问欢迎联系教会同工。
          </p>
          <dl className="site-givcard">
            {rows.map((row) => (
              <div className={`site-givcard-row${row.accent ? " site-givcard-row--accent" : ""}`} key={row.label}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="site-giving-actions">
            <a className="site-btn-primary" href="/building/">建堂专题</a>
            <a className="site-btn-ghost" href="/">返回首页</a>
          </div>
        </div>
      </section>
    </main>
  );
}