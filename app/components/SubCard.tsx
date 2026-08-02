import type { Verse } from "../verses";

// 金色星芒点缀（插画右上/底部的高光细节）
function Sparkle({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  const d = `M${x} ${y - 5 * s}c.6 1.6 1.9 2.9 3.5 3.5-1.6 .6-2.9 1.9-3.5 3.5-.6-1.6-1.9-2.9-3.5-3.5 1.6-.6 2.9-1.9 3.5-3.5z`;
  return <path d={d} stroke="none" fill="rgba(233,200,120,.9)" />;
}

// 线稿插画库（白色描边 + 金色星芒，viewBox 48）。与 SubCard 的 tone 渐变图头搭配，
// 作为子栏目「配图」。真实照片就绪后可替换图头部分。
const ICONS: Record<string, React.ReactNode> = {
  // 儿童主日学：翻开书本
  book: (
    <>
      <path d="M24 12v26M24 12c-5-3-11-3-14-2v24c3-1 9-1 14 2 5-3 11-3 14-2V10c-3-1-9-1-14 2z" />
      <Sparkle x={40} y={9} />
    </>
  ),
  // 青少年团契：火焰
  flame: (
    <>
      <path d="M24 6c2 7-6 9-6 16a6 6 0 0 0 12 0c0-4-2-6-3-8-2 2-4 3-5 6 0-6 1-9 2-14z" />
      <Sparkle x={39} y={8} />
    </>
  ),
  // 姊妹团契：百合
  lily: (
    <>
      <path d="M24 42V18M24 18c0-6 4-10 10-12-2 8-6 12-10 12zM24 18c0-6-4-10-10-12 2 8 6 12 10 12zM24 23c3 3 3 8 0 11-3-3-3-8 0-11z" />
      <Sparkle x={40} y={9} />
    </>
  ),
  // 弟兄团契：麦穗
  wheat: (
    <>
      <path d="M24 42V10M24 10c-5 1-8 5-8 10 0 6 8 8 8 8s8-2 8-8c0-5-3-9-8-10z" />
      <Sparkle x={40} y={9} s={0.8} />
    </>
  ),
  // 教会探访：相握的手
  hands: (
    <>
      <path d="M12 30c3-5 8-8 12-8s9 3 12 8M12 30v10M36 30v10M12 40h24M10 36l-4-6c2 4 4 6 6 6M38 36l4-6c-2 4-4 6-6 6" />
      <Sparkle x={40} y={8} />
    </>
  ),
  // 节日活动：彩星
  star: (
    <>
      <path d="M24 6l3 7 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z" />
      <Sparkle x={40} y={10} s={0.8} />
    </>
  ),
  // 建堂异象：塔楼
  tower: (
    <>
      <path d="M20 42V24h8v18M14 24h20M24 24l-8-8M24 24l8-8M12 42h24M22 30h4M22 34h4" />
      <Sparkle x={40} y={8} />
    </>
  ),
  // 建堂历程：里程碑
  milestone: (
    <>
      <path d="M24 4v34M14 38h20M24 12l6 8H18zM14 42h20" />
      <Sparkle x={40} y={9} s={0.8} />
    </>
  ),
  // 工程进度：蓝图
  blueprint: (
    <>
      <path d="M8 40V8l32 32H8zM14 40l12-12M22 40l14-14M8 40h32" />
      <Sparkle x={40} y={8} />
    </>
  ),
  // 建堂祷告：烛台
  candle: (
    <>
      <path d="M24 42v-8M24 34c-5 0-8-4-8-8 0-5 4-8 8-8s8 3 8 8c0 4-3 8-8 8zM24 14v-4" />
      <Sparkle x={40} y={9} />
    </>
  ),
  // 建堂奉献：麦穗十架
  "cross-wheat": (
    <>
      <path d="M24 6v30M14 16h20M24 6c-4 0-7 3-7 8h7M24 6c4 0 7 3 7 8h-7M20 42h8" />
      <Sparkle x={40} y={9} s={0.8} />
    </>
  ),
  // 建堂见证：泉源
  well: (
    <>
      <path d="M24 42c-8-6-12-11-12-17a12 12 0 0 1 24 0c0 6-4 11-12 17zM18 26c1-4 3-7 6-9" />
      <Sparkle x={40} y={8} />
    </>
  ),
};

// 子栏目卡片：渐变图头（细线插画 + 金色星芒）+ 标题 + 经文寄语
export default function SubCard({
  label,
  verse,
  tone,
  icon,
}: {
  label: string;
  verse: Verse;
  tone: string;
  icon: string;
}) {
  return (
    <article className="site-subcard">
      <div className={`site-subcard-photo ${tone}`} aria-hidden="true">
        <svg viewBox="0 0 48 48" width="40" height="40" fill="none" stroke="rgba(255,255,255,.94)" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          {ICONS[icon] ?? ICONS.star}
        </svg>
      </div>
      <b>{label}</b>
      <blockquote className="site-verse site-verse--paper">
        <p className="site-verse-text">「{verse.text}」</p>
        <footer>——{verse.ref}</footer>
      </blockquote>
    </article>
  );
}
