// 全站经文寄语单一来源（第一版）。
// 经文统一使用繁体字（教会惯例）。后续如需「每月寄语 / 活动专属经文」，
// 可在后台数据源扩展此文件为可配置结构。
export type Verse = {
  text: string; // 经文正文（繁体）
  ref: string; // 出处（繁体）
};

export const VERSE_COLUMNS: Record<string, Verse> = {
  worship: {
    text: "來啊，我們要屈身敬拜，在造我們的耶和華面前跪下。",
    ref: "詩篇 95:6",
  },
  growth: {
    text: "惟用愛心說誠實話，凡事長進，連於元首基督。",
    ref: "以弗所書 4:15",
  },
  "bible-study": {
    text: "聖經都是神所默示的，於教訓、督責、使人歸正、教導人學義都是有益的。",
    ref: "提摩太後書 3:16",
  },
  building: {
    text: "若不是耶和華建造房屋，建造的人就枉然勞力。",
    ref: "詩篇 127:1",
  },
  giving: {
    text: "各人要隨本心所酌定的，不要作難，不要勉強，因為捐得樂意的人是神所喜愛的。",
    ref: "哥林多後書 9:7",
  },
  care: {
    text: "你們各人的重擔要互相擔當，如此，就完全了基督的律法。",
    ref: "加拉太書 6:2",
  },
  about: {
    text: "你們若有彼此相愛的心，眾人因此就認出你們是我的門徒了。",
    ref: "約翰福音 13:35",
  },
};

// 教会成长 → 子栏目寄语
export const GROWTH_SUBCOLUMNS: { slug: string; label: string; verse: Verse }[] = [
  {
    slug: "sunday-school",
    label: "兒童主日學",
    verse: { text: "教養孩童，使他走當行的道，就是到老他也不偏離。", ref: "箴言 22:6" },
  },
  {
    slug: "youth",
    label: "青少年團契",
    verse: {
      text: "不可叫人小看你年輕，總要在言語、行為、愛心、信心、清潔上，都作信徒的榜樣。",
      ref: "提摩太前書 4:12",
    },
  },
  {
    slug: "sisters",
    label: "姊妹團契",
    verse: { text: "最要緊的是彼此切實相愛，因為愛能遮掩許多的罪。", ref: "彼得前書 4:8" },
  },
  {
    slug: "brothers",
    label: "弟兄團契",
    verse: { text: "兩個人總比一個人好，因為二人勞碌同得美好的果效。", ref: "傳道書 4:9" },
  },
  {
    slug: "visitation",
    label: "教會探訪",
    verse: {
      text: "這些事你們既作在我這弟兄中一個最小的身上，就是作在我身上了。",
      ref: "馬太福音 25:40",
    },
  },
  {
    slug: "festivals",
    label: "節日與特別活動",
    verse: { text: "耶和華果然為我們行了大事，我們就歡喜。", ref: "詩篇 126:3" },
  },
];

// 建堂专题 → 主题寄语
export const BUILDING_TOPICS: { slug: string; label: string; verse: Verse }[] = [
  {
    slug: "vision",
    label: "建堂異象",
    verse: { text: "你當擴張你帳幕之地，張大你居所的幔子，不要限止。", ref: "以賽亞書 54:2" },
  },
  {
    slug: "journey",
    label: "建堂歷程",
    verse: { text: "那在你們心裡動了善工的，必成全這工。", ref: "腓立比書 1:6" },
  },
  {
    slug: "progress",
    label: "工程進度",
    verse: { text: "不要藐視這日的事為小。", ref: "撒迦利亞書 4:10" },
  },
  {
    slug: "prayer",
    label: "建堂禱告",
    verse: {
      text: "你求告我，我就應允你，並將你所不知道、又大又難的事指示你。",
      ref: "耶利米書 33:3",
    },
  },
  {
    slug: "offering",
    label: "建堂奉獻",
    verse: {
      text: "各人要隨本心所酌定的，不要作難，不要勉強，因為捐得樂意的人是神所喜愛的。",
      ref: "哥林多後書 9:7",
    },
  },
  {
    slug: "testimony",
    label: "建堂見證",
    verse: { text: "耶和華以便以謝，到如今耶和華都幫助我們。", ref: "撒母耳記上 7:12" },
  },
];
