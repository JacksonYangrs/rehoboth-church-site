// 利河伯教会网站 v2 — D1 数据表（Drizzle ORM, SQLite dialect）
// 表：posts（活动记录）/ media（照片视频）/ bible_study（查经公告）
//     care_messages（爱心窗口留言）/ membership（会员接纳）/ admins（管理员）
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  columnSlug: text("column_slug").notNull(), // sunday-school / youth / sisters / brothers / visitation / festivals / worship / building
  title: text("title").notNull(),
  date: text("date").notNull(), // 活动日期 YYYY-MM-DD
  content: text("content").default(""), // 文字记录 / 见证
  cover: text("cover").default(""), // 封面（R2 URL 或 Stream 缩略图）
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const media = sqliteTable("media", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  postId: integer("post_id").notNull(), // -> posts.id
  kind: text("kind").notNull(), // photo | video
  url: text("url").notNull(), // R2 地址（photo）或 Stream 播放 ID（video）
  caption: text("caption").default(""),
  sort: integer("sort").default(0),
});

export const bibleStudy = sqliteTable("bible_study", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  week: text("week").notNull(), // 周次，如 2026-W32
  date: text("date").notNull(), // 周五日期 YYYY-MM-DD
  topic: text("topic").notNull(), // 查经主题
  passage: text("passage").default(""), // 查考经文
  zoomUrl: text("zoom_url").default(""), // Zoom 链接
  leader: text("leader").default(""), // 带领同工
  notes: text("notes").default(""),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const careMessages = sqliteTable("care_messages", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").default("匿名"), // 称呼（可匿名）
  contact: text("contact").default(""), // 联系方式（可选）
  category: text("category").notNull(), // 人际关系/家庭/子女教育/信仰疑问/情绪压力/其他
  content: text("content").notNull(),
  status: text("status").default("new"), // new -> following -> done
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const membership = sqliteTable("membership", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").default(""),
  contact: text("contact").default(""), // 微信/邮箱/电话
  intent: text("intent").default(""), // 想了解信仰/想参加聚会/想加入教会
  message: text("message").default(""),
  status: text("status").default("new"), // new -> contacted -> done
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

export const admins = sqliteTable("admins", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});
