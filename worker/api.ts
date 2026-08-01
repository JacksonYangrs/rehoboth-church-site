// 利河伯教会网站 v2 — 公开 API（Cloudflare Workers）
// 挂载路径：/api/v1/*
//   GET  /api/v1/health        健康检查
//   GET  /api/v1/posts?column= 活动记录列表（含照片/视频）
//   GET  /api/v1/bible-study   查经公告列表（最新在前）
//   POST /api/v1/care-messages 爱心窗口匿名留言
//   POST /api/v1/membership    会员接纳申请
import { eq, desc, inArray } from "drizzle-orm";
import { getDb } from "../db";
import { posts, media, bibleStudy, careMessages, membership } from "../db/schema";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8" };

type Db = Awaited<ReturnType<typeof getDb>>;

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), { status, headers: JSON_HEADERS });
}

function error(message: string, status = 400): Response {
  return json({ ok: false, error: message }, status);
}

function allowCors(headers: Headers): void {
  // 公开只读/写入 API：允许静态站点跨域调用。生产建议限定来源。
  headers.set("access-control-allow-origin", "*");
  headers.set("access-control-allow-methods", "GET, POST, OPTIONS");
  headers.set("access-control-allow-headers", "content-type");
}

export async function handleApi(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api\/v1/, "").replace(/\/+$/, "") || "/";
  const db = await getDb();

  // 预检
  if (request.method === "OPTIONS") {
    const headers = new Headers();
    allowCors(headers);
    return new Response(null, { status: 204, headers });
  }

  let body: Response;
  switch (request.method) {
    case "GET":
      if (path === "/health") body = json({ ok: true, service: "rehoboth-api", time: Date.now() });
      else if (path === "/posts") body = await getPosts(db, url.searchParams.get("column") ?? "");
      else if (path === "/bible-study") body = await getBibleStudies(db);
      else body = error("not found", 404);
      break;
    case "POST":
      if (path === "/care-messages") body = await postCareMessage(db, request);
      else if (path === "/membership") body = await postMembership(db, request);
      else body = error("not found", 404);
      break;
    default:
      body = error("method not allowed", 405);
  }

  const headers = new Headers(body.headers);
  allowCors(headers);
  return new Response(body.body, { status: body.status, headers });
}

// 活动记录 + 媒体组装
async function getPosts(db: Db, column: string) {
  const list = column
    ? await db.select().from(posts).where(eq(posts.columnSlug, column)).orderBy(desc(posts.date))
    : await db.select().from(posts).orderBy(desc(posts.date));
  if (list.length === 0) return json({ ok: true, data: [] });

  const ids = list.map((p) => p.id);
  const mediaList = await db.select().from(media).where(inArray(media.postId, ids)).orderBy(media.sort);
  const byPost = new Map<number, typeof mediaList>();
  for (const m of mediaList) {
    const arr = byPost.get(m.postId) ?? [];
    arr.push(m);
    byPost.set(m.postId, arr);
  }
  const data = list.map((p) => ({ ...p, media: byPost.get(p.id) ?? [] }));
  return json({ ok: true, data });
}

async function getBibleStudies(db: Db) {
  const list = await db.select().from(bibleStudy).orderBy(desc(bibleStudy.date));
  return json({ ok: true, data: list });
}

async function postCareMessage(db: Db, request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return error("invalid json");
  }
  const p = payload as Record<string, unknown>;
  const category = String(p.category ?? "").trim();
  const content = String(p.content ?? "").trim();
  if (!category || !content) return error("category 与 content 为必填");
  if (content.length > 4000) return error("content 过长（≤4000 字符）");

  const row = await db
    .insert(careMessages)
    .values({
      name: String(p.name ?? "匿名").slice(0, 40),
      contact: String(p.contact ?? "").slice(0, 120),
      category,
      content,
    })
    .returning({ id: careMessages.id, createdAt: careMessages.createdAt });
  return json({ ok: true, data: row[0] }, 201);
}

async function postMembership(db: Db, request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return error("invalid json");
  }
  const p = payload as Record<string, unknown>;
  const message = String(p.message ?? "").trim();
  if (message.length > 4000) return error("message 过长（≤4000 字符）");

  const row = await db
    .insert(membership)
    .values({
      name: String(p.name ?? "").slice(0, 40),
      contact: String(p.contact ?? "").slice(0, 120),
      intent: String(p.intent ?? "").slice(0, 40),
      message,
    })
    .returning({ id: membership.id, createdAt: membership.createdAt });
  return json({ ok: true, data: row[0] }, 201);
}
