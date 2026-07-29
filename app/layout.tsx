import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "聖經 · 和合本生僻字標音版",
  description: "带拼音、熟字记忆与快速预排的和合本圣经阅读器。",
  openGraph: {
    title: "聖經 · 和合本生僻字標音版",
    description: "带拼音、熟字记忆与快速预排的和合本圣经阅读器。",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      <body>{children}</body>
    </html>
  );
}
