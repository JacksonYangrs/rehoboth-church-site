// 「筹备中」占位页，供设计文档中尚未展开内容的栏目复用。
export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="site-placeholder">
      <div className="site-placeholder-inner">
        <p className="eyebrow-light">筹备中 · COMING SOON</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <div className="site-placeholder-actions">
          <a className="site-btn-primary" href="/">返回首页</a>
          <a className="site-btn-ghost" href="/devotion/">进入每日灵修</a>
        </div>
      </div>
    </main>
  );
}
