// 全站导航单一来源。href 带尾斜杠，构建后脚本会注入 GitHub Pages 子路径前缀。
// 注：vinext 预渲染无法处理中文目录名路由（ByteString 错误），故路由用 ASCII slug，
// 导航标签仍显示中文。访问地址示例：/devotion、/worship。
export const NAV_ITEMS = [
  { label: "首页", href: "/" },
  { label: "每日灵修", href: "/devotion/" },
  { label: "线上敬拜", href: "/worship/" },
  { label: "教会成长", href: "/growth/" },
  { label: "查经公告", href: "/bible-study/" },
  { label: "建堂专题", href: "/building/" },
  { label: "奉献", href: "/giving/" },
  { label: "爱心窗口", href: "/care/" },
  { label: "认识教会", href: "/about/" },
] as const;

// 首页栏目网格（排除「首页」与已单独呈现的「每日灵修」）。
// verseKey 对应 app/verses.ts 中 VERSE_COLUMNS 的键，首页卡片与栏目页共用同一句经文。
export const HOME_COLUMNS = [
  { label: "線上敬拜", href: "/worship/", icon: "✝", verseKey: "worship", desc: "主日敬拜、講道、詩歌與特別聚會。" },
  { label: "教會成長", href: "/growth/", icon: "❦", verseKey: "growth", desc: "兒童主日學、團契與教會探訪。" },
  { label: "查經公告", href: "/bible-study/", icon: "📖", verseKey: "bible-study", desc: "每週查經主題、經文與 Zoom 連結。" },
  { label: "建堂專題", href: "/building/", icon: "⛪", verseKey: "building", desc: "建堂異象、歷程與禱告記念。" },
  { label: "奉獻", href: "/giving/", icon: "♥", verseKey: "giving", desc: "日常、建堂與特別事工奉獻。" },
  { label: "愛心窗口", href: "/care/", icon: "✉", verseKey: "care", desc: "匿名、安全的牧養關懷入口。" },
  { label: "認識教會", href: "/about/", icon: "☩", verseKey: "about", desc: "教會簡介、異象與聚會信息。" },
] as const;
