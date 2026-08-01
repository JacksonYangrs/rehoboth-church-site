// D1 数据库访问（Cloudflare Workers 运行时）。
// 注意：cloudflare:workers 模块只在 Workers 运行时可用，Node 预渲染阶段会报错，
// 因此使用动态 import 延迟加载——仅当 API 真正被调用时才解析该模块。
import type { drizzle as DrizzleType } from "drizzle-orm/d1";

let _db: ReturnType<typeof DrizzleType> | null = null;

export async function getDb() {
  if (_db) return _db;
  const { env } = await import("cloudflare:workers");
  const { drizzle } = await import("drizzle-orm/d1");
  const schema = await import("./schema");
  if (!env.DB) {
    throw new Error(
      "Cloudflare D1 binding `DB` is unavailable. Set the `d1` field in .openai/hosting.json to `DB` or let your control plane inject the real binding values before using the database."
    );
  }
  _db = drizzle(env.DB, { schema });
  return _db;
}
