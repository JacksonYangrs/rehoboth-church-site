// 构建后处理：为静态产物注入 GitHub Pages 子路径前缀。
//
// 背景：vinext 0.0.50 若在 next.config 中设置 basePath，预渲染探测会失败、
// 首页不会生成 index.html（详见 next.config.ts 注释）。因此改为构建后重写。
//
// 用法：NEXT_PUBLIC_BASE_PATH=/rehoboth-church-site node scripts/apply-base-path.mjs

import { readdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CLIENT_DIR = join(root, "dist", "client");

const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath = rawBasePath.replace(/\/+$/, "");

if (!basePath) {
  console.log("未设置 NEXT_PUBLIC_BASE_PATH，跳过路径重写（根路径部署）。");
  process.exit(0);
}

async function collect(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await collect(full)));
    else if (/\.(html|css|js)$/.test(entry.name)) out.push(full);
  }
  return out;
}

// 只重写指向站内根路径的引用，跳过协议相对地址(//)和已带前缀的路径。
const patterns = [
  // HTML 属性：href="/x" src="/x"
  [/\b(href|src)=("|')\/(?!\/)/g, `$1=$2${basePath}/`],
  // HTML 属性：srcset / imagesrcset 里的根路径
  [/\b(srcset|imagesrcset)=("|')\/(?!\/)/g, `$1=$2${basePath}/`],
  // CSS：url(/x)
  [/url\((["']?)\/(?!\/)/g, `url($1${basePath}/`],
];

let changed = 0;
for (const file of await collect(CLIENT_DIR)) {
  const original = await readFile(file, "utf8");
  let next = original;
  for (const [pattern, replacement] of patterns) next = next.replace(pattern, replacement);
  // 幂等保护：避免重复执行时叠加前缀
  next = next.replaceAll(`${basePath}${basePath}/`, `${basePath}/`);
  if (next !== original) {
    await writeFile(file, next);
    changed += 1;
  }
}

console.log(`已为 ${changed} 个文件注入前缀 "${basePath}"。`);
