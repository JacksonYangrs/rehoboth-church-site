// 全站导航单一来源。href 带尾斜杠，构建后脚本会注入 GitHub Pages 子路径前缀。
// 注：vinext 预渲染无法处理中文目录名路由（ByteString 错误），故路由用 ASCII slug，
// 导航标签仍显示中文。访问地址示例：/devotion、/worship。
export const NAV_ITEMS = [
  { label: "首页", href: "/" },
  { label: "认识教会", href: "/about/" },
  { label: "每日灵修", href: "/devotion/" },
  { label: "线上敬拜", href: "/worship/" },
  { label: "教会成长", href: "/growth/" },
  { label: "查经公告", href: "/bible-study/" },
  { label: "建堂专题", href: "/building/" },
  { label: "奉献", href: "/giving/" },
  { label: "爱心窗口", href: "/care/" },
] as const;

// 首页栏目网格（排除「首页」与已单独呈现的「每日灵修」）。
// verseKey 对应 app/verses.ts 中 VERSE_COLUMNS 的键，首页卡片与栏目页共用同一句经文。
export const HOME_COLUMNS = [
  { label: "线上敬拜", href: "/worship/", icon: "✝", verseKey: "worship", desc: "主日敬拜、讲道、诗歌与特别聚会。" },
  { label: "教会成长", href: "/growth/", icon: "❦", verseKey: "growth", desc: "儿童主日学、团契与教会探访。" },
  { label: "查经公告", href: "/bible-study/", icon: "📖", verseKey: "bible-study", desc: "每周查经主题、经文与 Zoom 连结。" },
  { label: "建堂专题", href: "/building/", icon: "⛪", verseKey: "building", desc: "建堂异象、历程与祷告记念。" },
  { label: "奉献", href: "/giving/", icon: "♥", verseKey: "giving", desc: "日常、建堂与特别事工奉献。" },
  { label: "爱心窗口", href: "/care/", icon: "✉", verseKey: "care", desc: "匿名、安全的牧养关怀入口。" },
  { label: "认识教会", href: "/about/", icon: "☩", verseKey: "about", desc: "教会简介、异象与聚会信息。" },
] as const;
