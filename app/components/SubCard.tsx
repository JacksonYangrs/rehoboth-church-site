import type { Verse } from "../verses";

// 子栏目卡片：写实照片图头 + 标题 + 经文寄语
// 图头尺寸：约 360×180（4:2 横版，自动 cover 裁切，工具生成的水印会被自然裁出）
export default function SubCard({
  label,
  verse,
  image,
  alt,
}: {
  label: string;
  verse: Verse;
  image: string;
  alt: string;
}) {
  return (
    <article className="site-subcard">
      <div className="site-subcard-photo" aria-hidden="true">
        <img src={image} alt={alt} loading="lazy" />
      </div>
      <b>{label}</b>
      <blockquote className="site-verse site-verse--paper">
        <p className="site-verse-text">「{verse.text}」</p>
        <footer>——{verse.ref}</footer>
      </blockquote>
    </article>
  );
}
