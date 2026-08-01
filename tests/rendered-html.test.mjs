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

test("其余栏目占位页已生成", async () => {
  for (const col of PLACEHOLDER_COLUMNS) {
    assert.ok(await exists(join(CLIENT, col, "index.html")), `缺少占位页 ${col}/index.html`);
  }
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
