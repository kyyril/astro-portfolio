import { defineConfig } from "vitest/config";
import { getViteConfig } from "astro/config";

export default defineConfig(
  getViteConfig({
    test: {
      globals: true,
      environment: "happy-dom",
      setupFiles: ["./src/test/setup.ts"],
      include: ["src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
      exclude: ["node_modules", "dist", ".astro", "src/test/e2e/**"],
      coverage: {
        provider: "v8",
        reporter: ["text", "json", "html"],
        exclude: [
          "node_modules/",
          "src/test/",
          "**/*.d.ts",
          "**/*.config.*",
          "dist/",
          ".astro/",
        ],
      },
      // Performance testing configuration
      benchmark: {
        include: ["src/**/*.{bench,benchmark}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
        exclude: ["node_modules", "dist", ".astro"],
      },
    },
  })
);
