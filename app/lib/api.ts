// 前端 API 客户端（公开只读 + 表单写入）。
// NEXT_PUBLIC_API_URL 构建期注入（如 https://rehoboth-api.xxx.workers.dev）。
// 未配置（本地开发/未部署后台）时返回空态，页面优雅降级。
export const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export type PostItem = {
  id: number;
  columnSlug: string;
  title: string;
  date: string;
  content: string;
  cover: string;
  media: { id: number; kind: "photo" | "video"; url: string; caption: string }[];
};

export type BibleStudyItem = {
  id: number;
  week: string;
  date: string;
  time: string;
  venue: string;
  topic: string;
  passage: string;
  zoomUrl: string;
  leader: string;
  notes: string;
};

export async function getPosts(column: string): Promise<PostItem[]> {
  if (!API_BASE) return [];
  const res = await fetch(`${API_BASE}/api/v1/posts?column=${encodeURIComponent(column)}`);
  if (!res.ok) return [];
  const body = (await res.json()) as { ok: boolean; data: PostItem[] };
  return body.data ?? [];
}

export async function getBibleStudies(): Promise<BibleStudyItem[]> {
  if (!API_BASE) return [];
  const res = await fetch(`${API_BASE}/api/v1/bible-study`);
  if (!res.ok) return [];
  const body = (await res.json()) as { ok: boolean; data: BibleStudyItem[] };
  return body.data ?? [];
}

export async function submitCareMessage(payload: {
  name?: string;
  contact?: string;
  category: string;
  content: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!API_BASE) return { ok: false, error: "后台服务未配置" };
  try {
    const res = await fetch(`${API_BASE}/api/v1/care-messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { ok: false, error: "网络异常" };
  }
}

export async function submitMembership(payload: {
  name?: string;
  contact?: string;
  intent?: string;
  message?: string;
}): Promise<{ ok: boolean; error?: string }> {
  if (!API_BASE) return { ok: false, error: "后台服务未配置" };
  try {
    const res = await fetch(`${API_BASE}/api/v1/membership`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    return { ok: false, error: "网络异常" };
  }
}
