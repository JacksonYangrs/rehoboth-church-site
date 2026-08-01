// 校验静态导出产物可直接部署到 GitHub Pages。
// 运行前需先构建：npm run build:pages（或 npm run build）
import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLIENT = join(root, "dist", "client");
const exists = (p) => access(p).then(() => true, () => false);

const PLACEHOLDER_COLUMNS = [
  "worship", "growth", "bible-study", "building", "giving", "care", "about",
];
test("静态导出产出教会首页", async () => {
  assert.ok(await exists(join(CLIENT, "index.html")), "缺少 index.html —— 首页未被预渲染");
  const html = await readFile(join(CLIENT, "index.html"), "utf8");
  assert.match(html, /利河伯教会/);
  assert.match(html, /<script|modulepreload/, "首页未挂载客户端脚本");
  // 首页栏目卡片标题下方应显示经文寄语（繁体）
  assert.match(html, /來啊，我們要屈身敬拜/, "首页缺少线上敬拜栏目经文寄语");
  assert.match(html, /若不是耶和華建造房屋/, "首页缺少建堂专题栏目经文寄语");
});

test("灵修栏目已拆分为独立路由 /devotion", async () => {
  const path = join(CLIENT, "devotion", "index.html");
  assert.ok(await exists(path), "缺少 devotion/index.html —— 灵修栏目未被预渲染");
  const html = await readFile(path, "utf8");
  assert.match(html, /每日与主同行/);
  // 灵修页是客户端组件：周数据 fetch 在浏览器运行时执行，路径出现在 JS bundle 而非预渲染 HTML。
  const assets = await readdir(join(CLIENT, "assets"));
  const jsWithFetch = assets.filter((f) => f.endsWith(".js"));
  let found = false;
  for (const f of jsWithFetch) {
    const js = await readFile(join(CLIENT, "assets", f), "utf8");
    if (js.includes("devotion/week-")) { found = true; break; }
  }
  assert.ok(found, "JS bundle 未包含 devotion/week- 静态周数据读取路径");
});

test("首页不再依赖服务端 API", async () => {
  assert.equal(await exists(join(root, "app", "api")), false, "app/api 仍存在，静态站点无法提供接口");
  const page = await readFile(join(root, "app", "devotion", "page.tsx"), "utf8");
  assert.doesNotMatch(page, /\/api\//, "灵修 page.tsx 仍在请求 /api/ 路径");
  assert.match(page, /devotion\/week-/, "灵修 page.tsx 未改为读取静态周数据");
});

test("其余栏目页已生成且挂载经文寄语", async () => {
  const verseExpectations = [
    ["worship", "來啊，我們要屈身敬拜"],
    ["bible-study", "聖經都是神所默示的"],
    ["care", "你們各人的重擔要互相擔當"],
    ["about", "你們若有彼此相愛的心"],
  ];
  for (const [col, verseFragment] of verseExpectations) {
    const path = join(CLIENT, col, "index.html");
    assert.ok(await exists(path), `缺少页面 ${col}/index.html`);
    const html = await readFile(path, "utf8");
    assert.match(html, new RegExp(verseFragment), `${col} 页缺少经文寄语：${verseFragment}`);
  }
});

test("教会成长页展示子栏目经文寄语", async () => {
  const path = join(CLIENT, "growth", "index.html");
  assert.ok(await exists(path), "缺少 growth/index.html");
  const html = await readFile(path, "utf8");
  for (const fragment of ["教養孩童", "不可叫人小看你年輕", "兩個人總比一個人好", "這些事你們既作在我這弟兄中"]) {
    assert.match(html, new RegExp(fragment), `教会成长页缺少子栏目经文：${fragment}`);
  }
});

test("教会成长 6 个专栏页已生成", async () => {
  const columns = ["sunday-school", "youth", "sisters", "brothers", "visitation", "festivals"];
  for (const col of columns) {
    const path = join(CLIENT, "growth", col, "index.html");
    assert.ok(await exists(path), `缺少专栏页 growth/${col}/index.html`);
    const html = await readFile(path, "utf8");
    assert.match(html, /活動回顧/, `专栏页 growth/${col} 缺少活动回顾区`);
  }
});

test("查经公告页含公告列表与经文", async () => {
  const path = join(CLIENT, "bible-study", "index.html");
  assert.ok(await exists(path), "缺少 bible-study/index.html");
  const html = await readFile(path, "utf8");
  assert.match(html, /聖經都是神所默示的/, "查经公告页缺少经文寄语");
  assert.match(html, /每週查經/, "查经公告页缺少公告区块");
});

test("爱心窗口页含匿名表单", async () => {
  const path = join(CLIENT, "care", "index.html");
  assert.ok(await exists(path), "缺少 care/index.html");
  const html = await readFile(path, "utf8");
  assert.match(html, /想說的話/, "爱心窗口页缺少诉说输入框");
  assert.match(html, /送出傾訴/, "爱心窗口页缺少提交按钮");
});

test("认识教会页含会员接纳表单", async () => {
  const path = join(CLIENT, "about", "index.html");
  assert.ok(await exists(path), "缺少 about/index.html");
  const html = await readFile(path, "utf8");
  assert.match(html, /會員發展與接納/, "认识教会页缺少会员接纳区块");
  assert.match(html, /你的心願/, "认识教会页缺少意愿选择");
});

test("建堂专题页展示主题经文寄语", async () => {
  const path = join(CLIENT, "building", "index.html");
  assert.ok(await exists(path), "缺少 building/index.html");
  const html = await readFile(path, "utf8");
  for (const fragment of ["你當擴張你帳幕之地", "不要藐視這日的事為小", "耶和華以便以謝"]) {
    assert.match(html, new RegExp(fragment), `建堂专题页缺少主题经文：${fragment}`);
  }
});

test("奉献页为银行账户展示页（账户信息待教会确认）", async () => {
  const path = join(CLIENT, "giving", "index.html");
  assert.ok(await exists(path), "缺少 giving/index.html");
  const html = await readFile(path, "utf8");
  assert.match(html, /捐得樂意的人，是神所喜愛的/, "奉献页缺少经文寄语");
  assert.match(html, /銀行賬號/, "奉献页缺少银行账号字段");
  assert.match(html, /待教會確認/, "奉献页账户信息未标注待确认");
});

test("灵修数据已按周拆分并随产物发布", async () => {
  const dir = join(CLIENT, "devotion");
  assert.ok(await exists(dir), "产物缺少 devotion/ 数据目录");
  const files = await readdir(dir);
  assert.ok(files.includes("meta.json"), "缺少 meta.json");
  const weeks = files.filter((name) => /^week-\d+\.json$/.test(name));
  assert.equal(weeks.length, 52, `应有 52 个周数据文件，实际 ${weeks.length} 个`);

  const week1 = JSON.parse(await readFile(join(dir, "week-1.json"), "utf8"));
  assert.equal(week1.week, 1);
  assert.ok(week1.readings.length > 0, "week-1 无内容");
  assert.ok(week1.readings[0].days?.length > 0, "reading 缺少 days 字段");
});

test("子路径部署时资源前缀已注入（多页）", async () => {
  const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/+$/, "");
  if (!basePath) return; // 根路径部署无需前缀

  const pages = [join(CLIENT, "index.html"), join(CLIENT, "devotion", "index.html")];
  for (const page of pages) {
    const html = await readFile(page, "utf8");
    const rootRefs = [...html.matchAll(/(?:href|src)="(\/(?!\/)[^"]*)"/g)]
      .map((m) => m[1])
      .filter((href) => !href.startsWith(`${basePath}/`));
    assert.deepEqual(rootRefs, [], `以下资源未注入 ${basePath} 前缀，子路径下会 404：${rootRefs.join(", ")}`);
  }
});
