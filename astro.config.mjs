import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import auth from "auth-astro";

export default defineConfig({
  integrations: [
    react(),
    tailwind({
      applyBaseStyles: false,
    }),
    mdx(),
    auth(),
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
