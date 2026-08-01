import type { NextConfig } from "next";

// 注意：不要在这里设置 basePath。
// vinext 0.0.50 的静态导出会启动临时服务器、请求 "/" 来预渲染；
// 一旦设了 basePath，首页实际挂在 "/<basePath>/" 上，探测请求落空，
// 首页会被判定为 Unknown 并跳过，最终产物缺少 index.html。
// 子路径部署改由 scripts/apply-base-path.mjs 在构建后重写资源路径完成。
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
