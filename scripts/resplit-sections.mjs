// 每日灵修三段按内容性质重分割：
//   summary（摘要）= 对当天阅读经文的解释（正文讲解）
//   thought（思想） = 作者要我们思考的（默想反思）
//   practice（与主同行）= 为读者提出的行动（行动实践 + 附录扩展）
// 依据：行动词定位「与主同行」起点；反思词从后往前定位「思想」起点；叙事词排除误判。
// 用法：node scripts/resplit-sections.mjs（幂等，可重复运行）
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const SOURCE = fileURLToPath(new URL("../data/daily-walk.json", import.meta.url));

function norm(s) {
  return String(s).replace(/[\s\u00a0\u3000\xa0"「」『』“”‘’]/g, "");
}

// 与主同行（行动）：强行动词开头
const ACTION = /^(请|試|请试|背诵|背颂|写下|写出|列出|立志|立定|祷告|默想|细读|重读|再读|翻开|翻到|圈出|画出|算算|数一数|查考|打开|尝试|练习|操练|选择|唱|呼求|向神|向主|为他|为她|为他们|为这|本周|下周|今天你|今天尝试|每天|每日|每早|每周|下次|你愿意|你愿|让我们|弟兄姊妹，请你|请用|请把|请翻|请背)/;
// 思想（作者要我们思考的）：反思/问句开头
const REFLECT = /^(你(有|曾|可|会|能|是否|有没有|试|想|认|看)?|我们(是|每|要|应|可|不|若|当|真|有|都|这)?|值得|想想|想一想|试想|有没有想过|为什么|为何|有否|是否|请问|弟兄姊妹|世上|人生|生命中|信仰是|思想|默想一下|主啊|神啊)/;
// 叙事/解释排除词（避免正文被误判为思想）
const NARR = /^(神本来|神用|神在|神如何|神对|经文说|本章|本节|这段|此处|第[一二三四五六七八九十\d]+章|参|例如|首先|接着|然后|后来|当时|于是|所以|因为|不但|并且|再者|换言之|也就是说)/;

function resplit(reading) {
  const blocks = reading.blocks ?? [];
  const n = blocks.length;
  if (n === 0) return { summary: [], thought: [], practice: [] };

  const texts = blocks.map((b) => norm(b.type === "text" ? b.text : ""));

  // 锚点：reflectionPrompts 在 blocks 中的位置
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

  // 1) 与主同行起点：优先强行动词块（30% 之后），其次最后锚点
  let walkStart = -1;
  for (let i = Math.max(1, Math.floor(n * 0.3)); i < n; i++) {
    if (texts[i] && ACTION.test(texts[i])) {
      walkStart = i;
      break;
    }
  }
  if (walkStart < 0 && anchors.length > 0) walkStart = Math.min(n - 1, anchors[anchors.length - 1]);
  if (walkStart < 0) walkStart = Math.max(1, Math.floor(n * 0.6));

  // 2) 思想起点：walkStart 前，从后往前找反思块（遇叙事块停止）
  let medStart = walkStart;
  for (let i = walkStart - 1; i >= Math.max(0, Math.floor(n * 0.12)); i--) {
    if (!texts[i]) continue;
    if (NARR.test(texts[i])) break;
    if (REFLECT.test(texts[i])) {
      medStart = i;
      break;
    }
  }
  if (medStart === walkStart) medStart = Math.max(1, walkStart - 1);

  // 3) 兜底：摘要为空（超短文），取思想首块
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
console.log(`已按内容性质重分割 ${data.readings.length} 条，其中 ${changed} 条发生变化`);
