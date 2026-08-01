import type { Metadata } from "next";
import VerseQuote from "../components/VerseQuote";
import { VERSE_COLUMNS } from "../verses";

export const metadata: Metadata = { title: "奉獻 · 利河伯教會" };

// 银行账户信息由教会确认后填入。留空字段显示「待教會確認」。
// 字段结构：账户名称 / 开户银行 / 银行账号 / SWIFT / 币种 / 用途说明。
const ACCOUNT = {
  name: "",
  bank: "",
  number: "",
  swift: "",
  currency: "",
};

export default function Page() {
  const rows: { label: string; value: string; accent?: boolean }[] = [
    { label: "账户名稱", value: ACCOUNT.name || "待教會確認" },
    { label: "開戶銀行", value: ACCOUNT.bank || "待教會確認" },
    { label: "銀行賬號", value: ACCOUNT.number || "待教會確認", accent: true },
    { label: "SWIFT / BIC", value: ACCOUNT.swift || "待教會確認" },
    { label: "幣種", value: ACCOUNT.currency || "待教會確認" },
  ];

  return (
    <main className="site-page">
      <header className="site-page-head">
        <p className="eyebrow-light">GIVING · 奉獻</p>
        <h1>奉獻</h1>
        <VerseQuote verse={VERSE_COLUMNS.giving} />
        <p>你的奉獻支持教會的日常事工、建堂與各項關懷服侍。捐得樂意的人，是神所喜愛的。</p>
      </header>

      <section className="site-page-body">
        <div className="site-giving">
          <p className="site-giving-note">
            奉獻可分為：<b>日常奉獻</b>（教會經常費）、<b>建堂奉獻</b>（建堂專款）與
            <b>特別事工奉獻</b>。匯款時請註明用途，若有疑問歡迎聯繫教會同工。
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
            <a className="site-btn-primary" href="/building/">建堂專題</a>
            <a className="site-btn-ghost" href="/">返回首頁</a>
          </div>
        </div>
      </section>
    </main>
  );
}
