import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import auth from "auth-astro";
import cloudflare from "@astrojs/cloudflare";

export default defineConfig({
  site: "https://kyyril.pages.dev", // Ganti dengan domain Anda
  integrations: [
    react({
      experimentalReactChildren: true,
    }),
    tailwind({
      applyBaseStyles: true,
      config: {
        content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
      },
    }),
    mdx({
      optimize: true,
      remarkPlugins: [],
      rehypePlugins: [],
    }),
    auth(),
  ],
  output: "server",
  adapter:
    process.env.NODE_ENV === "development"
      ? node({ mode: "standalone" })
      : cloudflare({
          mode: "directory",
          imageService: "compile",
          platformProxy: {
            enabled: true,
          },
        }),
  collections: {
    blog: {
      type: "content",
    },
  },
  image: {
    service: {
      entrypoint: "astro/assets/services/sharp",
      config: {
        limitInputPixels: 268402689,
      },
    },
    domains: ["images.pexels.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.pexels.com",
      },
    ],
  },
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },

  build: {
    inlineStylesheets: "auto",
    split: true,
  },
  vite: {
    optimizeDeps: {
      include: [
        "react",
        "react-dom",
        "@prisma/client",
        "gsap",
        "gsap/ScrollTrigger",
        "gsap/TextPlugin",
        "gsap/ScrollToPlugin",
      ],
      exclude: ["@astrojs/cloudflare"],
    },
    ssr: {
      external: ["@prisma/client"],
      noExternal: ["gsap"],
    },
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["react", "react-dom"],
            gsap: ["gsap"],
          },
        },
      },
    },
    css: {
      devSourcemap: true,
    },
  },
});
