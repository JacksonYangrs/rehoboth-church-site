import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("ships the Bible reader instead of the disposable starter", async () => {
  const [page, layout, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(page, /全书预排/);
  assert.match(page, /SOURCE_URL/);
  assert.match(page, /api\/rare-lexicon/);
  assert.match(page, /setTimeout\([\s\S]*3000/);
  assert.match(page, /requestFullscreen/);
  assert.match(page, /chapterPages/);
  assert.match(layout, /和合本生僻字標音版/);
  assert.match(css, /turnNext/);
  assert.doesNotMatch(page, /SkeletonPreview/);
});
