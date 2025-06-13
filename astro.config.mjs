import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
  ],
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  collections: {
    blog: {
      type: "content",
    },
  },
  vite: {
    optimizeDeps: {
      include: ["react", "react-dom"],
    },
  },
});
