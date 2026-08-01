import { NextResponse } from "next/server";
import plan from "@/data/daily-walk.json";

export const runtime = "edge";

type Reading = (typeof plan.readings)[number];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const week = Number(searchParams.get("week"));
  const day = Number(searchParams.get("day"));

  if (!Number.isInteger(week) || !Number.isInteger(day) || week < 1 || week > 52 || day < 1 || day > 7) {
    return NextResponse.json({ error: "请提供有效的 week 与 day。" }, { status: 400 });
  }

  const reading = plan.readings.find((item: Reading) => item.week === week && item.days.includes(day));

  return NextResponse.json(
    {
      plan: {
        title: plan.title,
        author: plan.author,
        source: plan.source,
        sourceUrl: plan.sourceUrl,
      },
      reading: reading ?? null,
      fallback: reading ? null : { week, day },
    },
    { headers: { "Cache-Control": "public, max-age=3600" } },
  );
}
