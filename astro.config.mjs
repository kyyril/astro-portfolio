import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import node from "@astrojs/node";
import auth from "auth-astro";
import vercel from "@astrojs/vercel";

export default defineConfig({
  site: "https://your-project.vercel.app", // Update with your Vercel domain
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
    process.env.NODE_ENV === "production" && process.env.VERCEL
      ? vercel({
          webAnalytics: {
            enabled: true,
          },
          speedInsights: {
            enabled: true,
          },
        })
      : node({ mode: "standalone" }),
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
        // Optimize for performance
        jpeg: { quality: 80, progressive: true },
        png: { compressionLevel: 9, adaptiveFiltering: true },
        webp: { quality: 85, effort: 6 },
        avif: { quality: 80, effort: 6 },
      },
    },
    domains: ["images.pexels.com", "res.cloudinary.com", "i.pinimg.com"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.pexels.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
      },
    ],
  },
  prefetch: {
    prefetchAll: false,
    defaultStrategy: "hover",
  },

  build: {
    inlineStylesheets: "never",
    split: true,
    assets: "_astro",
    format: "file",
  },
  compressHTML: true,
  server: {
    headers: {
      "Cache-Control": "public, max-age=3600",
    },
  },
  vite: {
    optimizeDeps: {
      include: ["react", "react-dom", "@prisma/client"],
      exclude: ["gsap"],
    },
    ssr: {
      external: ["@prisma/client", "gsap"],
      noExternal: [],
    },
    build: {
      cssCodeSplit: true,
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: [
            "console.log",
            "console.info",
            "console.debug",
            "console.warn",
          ],
          passes: 3,
          unsafe: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_methods: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          unsafe_undefined: true,
        },
        mangle: {
          safari10: true,
          toplevel: true,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (id.includes("node_modules")) {
              if (id.includes("react")) return "react";
              if (id.includes("@prisma")) return "prisma";
              return "vendor";
            }
          },
          chunkFileNames: "assets/[name]-[hash].js",
          entryFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
        },
        treeshake: {
          preset: "recommended",
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          tryCatchDeoptimization: false,
        },
      },
    },
    css: {
      devSourcemap: true,
    },
  },
});
