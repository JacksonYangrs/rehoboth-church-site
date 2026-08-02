// 每日灵修三段重分割：修复 sections（summary=正文 / thought=默想 / practice=与主同行+附录）
// 依据《每日与主同行》固定结构 + reflectionPrompts 锚点 + 行动词特征。
// 用法：node scripts/resplit-sections.mjs
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const SOURCE = fileURLToPath(new URL("../data/daily-walk.json", import.meta.url));

function norm(s) {
  return String(s).replace(/[\s\u00a0\u3000\xa0"「」『』“”‘’]/g, "");
}

// 行动/邀请词：与主同行段常以此开头
const ACTION_PREFIX = /^(请|试|背|让|今天|你愿|你愿意|弟兄姊妹|姊妹|祷告|立|翻开|打开|查考|默想|思想|重读|细读|读|写|列出|圈|画)/;
// 反思词：默想段常以此开头
const REFLECT_PREFIX = /^(我们|你|弟兄姊妹|姊妹|今天|神|主|人生|生命|生活|当你|你曾|若你|不少|许多|人人|每个)/;

function resplit(reading) {
  const blocks = reading.blocks ?? [];
  const n = blocks.length;
  if (n === 0) return { summary: [], thought: [], practice: [] };

  const texts = blocks.map((b) => norm(b.type === "text" ? b.text : ""));

  // 1) 锚点：reflectionPrompts 在 blocks 中的位置（与主同行/反思句）
  const anchors = [];
  for (const p of reading.reflectionPrompts ?? []) {
    const np = norm(p);
    if (!np) continue;
    for (let i = 0; i < n; i++) {
      if (texts[i] && (texts[i].includes(np) || np.includes(texts[i]))) {
        anchors.push(i);
        break;
      }
    }
  }

  // 2) 找「与主同行」起点：优先取最后一个锚点；若最后锚点明显是正文，则取行动词特征块
  let walkStart = -1;
  if (anchors.length > 0) {
    walkStart = Math.min(n - 1, anchors[anchors.length - 1]);
  }
  // 若最后锚点位置太靠前（< 30%），用行动词特征补充
  if (walkStart < 0 || walkStart < Math.floor(n * 0.3)) {
    for (let i = Math.floor(n * 0.3); i < n; i++) {
      if (texts[i] && ACTION_PREFIX.test(texts[i])) {
        walkStart = i;
        break;
      }
    }
  }
  if (walkStart < 0) walkStart = Math.max(1, Math.floor(n * 0.6));

  // 3) 找「默想」起点：walkStart 之前，从后往前找反思块
  let medStart = walkStart;
  for (let i = walkStart - 1; i >= Math.floor(n * 0.15); i--) {
    if (texts[i] && REFLECT_PREFIX.test(texts[i])) {
      medStart = i;
      break;
    }
  }
  // 找不到反思块时：默想取 walkStart 前最后一段
  if (medStart === walkStart) medStart = Math.max(1, walkStart - 1);

  // 兜底：摘要为空（超短文），把思想段首块移入摘要，保证三段都有内容
  let summary = blocks.slice(0, medStart);
  let thought = blocks.slice(medStart, walkStart);
  const practice = blocks.slice(walkStart);
  if (summary.length === 0 && thought.length > 0) {
    summary = thought.slice(0, 1);
    thought = thought.slice(1);
  }
  return { summary, thought, practice };
}

const data = JSON.parse(await readFile(SOURCE, "utf8"));
let changed = 0;
for (const r of data.readings) {
  const s = resplit(r);
  if (JSON.stringify(s) !== JSON.stringify(r.sections)) changed++;
  r.sections = s;
}
await writeFile(SOURCE, JSON.stringify(data, null, 2));
console.log(`已重分割 ${data.readings.length} 条，其中 ${changed} 条发生变化`);
