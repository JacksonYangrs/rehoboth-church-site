import fs from "node:fs";

const sourcePath = "/Users/yangjackson/Workbuddy/2026-08-01-16-48-40/wells_of_grace/walk_with_lord.json";
const outputPath = "data/daily-walk.json";

const source = JSON.parse(fs.readFileSync(sourcePath, "utf8"));

const promptPattern = /请思想|请用颜色笔|请指出|请写|请找|请看看|问问自己|反省|有何意义|有何提醒|你觉得|你认为|你是否|你曾|你会|你将|你准备|怎样|如何|为什么|为何|完成下列表格|试/;
const practicePattern = /与主同行|实践|行动|应用|立志|付诸行动|现在|开始|尝试|请写下来|从.*开始|你将如何|你会如何|你会怎样|你准备怎样|你准备在|你将怎样|你要怎样|你怎样|怎样胜过|怎样弥补|如何改善|如何实践|如何应用|洁净自己吧|去感谢|抓紧机会|分享见证|回应主|委身的行动/;

function normalizeBlock(block) {
  if (block.type === "table") {
    return {
      type: "table",
      rows: (block.rows ?? [])
        .map((row) => row.map((cell) => String(cell ?? "").trim()))
        .filter((row) => row.some(Boolean)),
    };
  }

  return { type: "text", text: String(block.text ?? "").trim() };
}

function splitSections(blocks) {
  const normalized = blocks.map(normalizeBlock).filter((block) => {
    if (block.type === "table") return block.rows.length > 0;
    return block.text.length > 0;
  });

  const firstPromptIndex = normalized.findIndex((block) => block.type === "text" && promptPattern.test(block.text));
  const firstPracticeIndex = normalized.findIndex((block, index) => (
    index > Math.max(firstPromptIndex, -1) && block.type === "text" && practicePattern.test(block.text)
  ));

  if (firstPromptIndex < 0) {
    return {
      summary: normalized,
      thought: [],
      practice: [],
    };
  }

  if (firstPracticeIndex < 0) {
    const firstPromptBlock = normalized[firstPromptIndex];
    if (firstPromptBlock.type === "text" && practicePattern.test(firstPromptBlock.text)) {
      return {
        summary: normalized.slice(0, firstPromptIndex),
        thought: [],
        practice: normalized.slice(firstPromptIndex),
      };
    }

    return {
      summary: normalized.slice(0, firstPromptIndex),
      thought: normalized.slice(firstPromptIndex, firstPromptIndex + 1),
      practice: normalized.slice(firstPromptIndex + 1),
    };
  }

  return {
    summary: normalized.slice(0, firstPromptIndex),
    thought: normalized.slice(firstPromptIndex, firstPracticeIndex),
    practice: normalized.slice(firstPracticeIndex),
  };
}

function textBlocks(blocks) {
  return blocks.filter((block) => block.type === "text").map((block) => block.text);
}

function reflectionPrompts(sections) {
  const candidates = [...sections.thought, ...sections.practice]
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .filter((text) => promptPattern.test(text) || /[？?]/.test(text));
  return [...new Set(candidates)].slice(-4);
}

let id = 1;
const readings = [];

for (const week of source.weeks) {
  for (const day of week.days) {
    const dayNumbers = String(day.day)
      .split(/[、,，]/)
      .map((value) => Number(value.trim()))
      .filter(Number.isFinite);
    const sections = splitSections(day.blocks ?? []);
    const blocks = [...sections.summary, ...sections.thought, ...sections.practice];

    readings.push({
      id: id++,
      week: Number(day.week ?? week.week),
      days: dayNumbers,
      dayLabel: String(day.day),
      title: day.theme,
      scripture: day.scripture,
      keyVerse: day.key_verse,
      blocks,
      sections,
      paragraphs: textBlocks(blocks),
      reflectionPrompts: reflectionPrompts(sections),
    });
  }
}

const output = {
  title: source.title,
  author: source.author,
  source: source.source,
  sourceUrl: "https://wellsofgrace.com/books/devotion/walk_with_Lord/index.htm",
  structure: "每日内容按“摘要 / 思想 / 与主同行”分区，并保留原始表格。",
  readings,
};

fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`);

const tableCount = readings.reduce((sum, reading) => sum + reading.blocks.filter((block) => block.type === "table").length, 0);
console.log(`Generated ${readings.length} readings with ${tableCount} tables.`);
