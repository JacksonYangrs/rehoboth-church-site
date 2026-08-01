// 将 data/daily-walk.json 按周拆分为静态 JSON，输出到 public/devotion/
// 静态站点（GitHub Pages）没有服务端，前端按需拉取单周数据，避免一次加载 3.3MB。
// 用法：node scripts/split-devotion-data.mjs
// 说明：周数据文件名是确定性的（week-1..52.json + meta.json），直接覆盖写入，
// 无需先删除目录；这也避免在本地安全删除守卫下批量删除 50+ 个文件。

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(root, "data", "daily-walk.json");
const OUT_DIR = join(root, "public", "devotion");

const plan = JSON.parse(await readFile(SOURCE, "utf8"));

await mkdir(OUT_DIR, { recursive: true });

// meta.json：计划元信息，前端启动时读取一次
await writeFile(
  join(OUT_DIR, "meta.json"),
  JSON.stringify({
    title: plan.title,
    author: plan.author,
    source: plan.source,
    sourceUrl: plan.sourceUrl,
    structure: plan.structure ?? null,
    weeks: [...new Set(plan.readings.map((item) => item.week))].sort((a, b) => a - b),
  }),
);

// week-N.json：该周全部日程，前端按 day 在本地筛选
const byWeek = new Map();
for (const reading of plan.readings) {
  if (!byWeek.has(reading.week)) byWeek.set(reading.week, []);
  byWeek.get(reading.week).push(reading);
}

let total = 0;
for (const [week, readings] of [...byWeek].sort((a, b) => a[0] - b[0])) {
  readings.sort((a, b) => Math.min(...a.days) - Math.min(...b.days));
  const body = JSON.stringify({ week, readings });
  await writeFile(join(OUT_DIR, `week-${week}.json`), body);
  total += body.length;
}

console.log(
  `已拆分 ${byWeek.size} 周 / ${plan.readings.length} 条，` +
    `输出至 public/devotion/（合计 ${(total / 1024 / 1024).toFixed(2)} MB，` +
    `单周平均 ${Math.round(total / byWeek.size / 1024)} KB）`,
);
