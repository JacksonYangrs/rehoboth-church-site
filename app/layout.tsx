import type { Metadata } from "next";
import "./globals.css";

// 静态导出（GitHub Pages）没有请求上下文，站点地址在构建期固定。
// 尾斜杠必须保留：new URL("og.png", ".../repo") 会丢掉 /repo 段，
// 只有 ".../repo/" 才能正确拼出子路径下的资源地址。
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://jacksonyangrs.github.io/rehoboth-church-site").replace(
  /\/*$/,
  "/",
);

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "每日与主同行",
  description: "今天自动定位的灵修阅读、共读分享与代祷同行。",
  openGraph: {
    title: "每日与主同行",
    description: "今天，一起安静聆听、思想、回应。",
    images: [{ url: "og.png", width: 1728, height: 972, alt: "每日与主同行" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "每日与主同行",
    description: "今天自动定位的灵修阅读、共读分享与代祷同行。",
    images: ["og.png"],
  },
  icons: { icon: "favicon.svg", shortcut: "favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-Hans"><body>{children}</body></html>;
}
