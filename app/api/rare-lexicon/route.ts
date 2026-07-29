const HOC6_SOURCE_URL = "https://www.hoc6.org/global?p=205";

type Entry = { pinyin: string; definition?: string; reference: string };

function decodeText(value: string) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&#8211;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function parseEntries(html: string) {
  const entries: Record<string, Entry> = {};
  const body = html.match(/<article id="post-205"[\s\S]*?<\/article>/)?.[0] || html;
  const rows = body.matchAll(/<p class="p0">([\s\S]*?)<\/p>/g);

  for (const row of rows) {
    const text = decodeText(row[1]);
    const match = text.match(/^([^\s]+)\s+([\u3400-\u9fff])\s+([A-Za-zÀ-ÿĀ-ǖ]+)\s*(.*)$/u);
    if (!match) continue;
    const [, reference, char, pinyin, afterPinyin] = match;
    // “不 dǔn” is a typographic truncation in the supplied article, not a valid entry for 不.
    if (char === "不") continue;
    const tokens = afterPinyin.split(/\s+/).filter(Boolean);
    tokens.shift(); // Homophone hint, e.g. “盾” in “沌 dùn 盾 …”.
    while (/^(?:[（(]?\d声[）)]?|阴平|阳平|上声|去声)$/.test(tokens[0] || "")) tokens.shift();
    entries[char] = { pinyin: pinyin.toLowerCase(), definition: tokens.join(" ") || undefined, reference };
  }
  return entries;
}

export async function GET() {
  try {
    const response = await fetch(HOC6_SOURCE_URL, { cache: "force-cache" });
    if (!response.ok) throw new Error(`source returned ${response.status}`);
    const entries = parseEntries(await response.text());
    return Response.json(
      { entries, source: HOC6_SOURCE_URL },
      { headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800" } },
    );
  } catch {
    return Response.json({ entries: {}, source: HOC6_SOURCE_URL }, { status: 200 });
  }
}
