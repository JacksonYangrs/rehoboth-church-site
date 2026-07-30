import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? "https";
  const origin = `${protocol}://${host}`;

  return {
    metadataBase: new URL(origin),
    title: "利河伯教会｜Rehoboth Church",
    description: "在这里，看见神的信实。利河伯教会的敬拜信息、教会活动与建堂见证。",
    openGraph: {
      title: "利河伯教会｜Rehoboth Church",
      description: "在这里，看见神的信实。",
      images: [{ url: "/og.png", width: 1728, height: 972, alt: "每日与主同行" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "每日与主同行",
      description: "今天，一起安静聆听、思想、回应。",
      images: ["/og.png"],
    },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hans"><body>{children}</body></html>;
}
