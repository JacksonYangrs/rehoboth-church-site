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
    title: "每日与主同行",
    description: "今天自动定位的灵修阅读、共读分享与代祷同行。",
    openGraph: {
      title: "每日与主同行",
      description: "今天，一起安静聆听、思想、回应。",
      images: [{ url: "/og.png", width: 1728, height: 972, alt: "每日与主同行" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "每日与主同行",
      description: "今天自动定位的灵修阅读、共读分享与代祷同行。",
      images: ["/og.png"],
    },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hans"><body>{children}</body></html>;
}
