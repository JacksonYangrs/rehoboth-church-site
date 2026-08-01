import type { Verse } from "../verses";

// 经文寄语块：放在栏目标题下方，采用较小宋体/楷体、居中排版。
// 无 JS、无状态，server component 可用。
export default function VerseQuote({ verse, tone = "light" }: { verse: Verse; tone?: "light" | "paper" }) {
  return (
    <blockquote className={`site-verse site-verse--${tone}`}>
      <p className="site-verse-text">「{verse.text}」</p>
      <footer>——{verse.ref}</footer>
    </blockquote>
  );
}
