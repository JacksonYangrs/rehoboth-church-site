import { NAV_ITEMS } from "../nav";

// 全站顶部导航。使用普通 <a> 而非 Next <Link>：
// 本项目刻意不在 next.config 设 basePath（否则 vinext 预渲染会失败），
// 因此 Next router 不知道子路径前缀；普通 <a> 由构建后脚本注入前缀，整页跳转在 Pages 上正确命中。
export default function SiteHeader() {
  return (
    <header className="site-nav">
      <div className="site-nav-inner">
        <a className="site-brand" href="/">
          <img className="site-brand-logo" src="/church-logo.jpeg" alt="利河伯教会 REHOBOTH CHURCH" />
          <span>
            <b>利河伯教会</b>
            <small>REHOBOTH CHURCH</small>
          </span>
        </a>
        <nav aria-label="主导航">
          <ul className="site-nav-links">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
