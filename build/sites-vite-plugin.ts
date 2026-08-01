import { access, cp, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

async function exists(path: string): Promise<boolean> {
  try {
    await access(path);
    return true;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return false;
    }
    throw error;
  }
}

// Packages Sites metadata and migrations after Vite finishes compiling.
export function sites(): Plugin {
  let root = process.cwd();

  return {
    name: "sites",
    apply: "build",
    configResolved(config) {
      root = config.root;
    },
    async closeBundle() {
      const outputDirectory = resolve(root, "dist", ".openai");
      const hostingConfig = resolve(root, ".openai", "hosting.json");
      const drizzleSource = resolve(root, "drizzle");

      // 内容固定（hosting.json + drizzle/*），且不重复覆盖：
      // mkdir + 仅当目标缺失时 cp，避免任何删除/替换操作被本地安全守卫拦截。
      await mkdir(outputDirectory, { recursive: true });

      const hostingOut = resolve(outputDirectory, "hosting.json");
      if ((await exists(hostingConfig)) && !(await exists(hostingOut))) {
        await cp(hostingConfig, hostingOut);
      }
      const drizzleOut = resolve(outputDirectory, "drizzle");
      if ((await exists(drizzleSource)) && !(await exists(drizzleOut))) {
        await cp(drizzleSource, drizzleOut, { recursive: true });
      }
    },
  };
}
