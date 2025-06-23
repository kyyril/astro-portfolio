import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || "https://your-project.vercel.app";

  // Static pages
  const staticPages = ["", "/projects", "/blog", "/guestbook", "/chat"];

  // Get dynamic blog posts
  const blogPosts = await getCollection("blog");

  // Get dynamic project pages (you might need to adjust this based on your data source)
  const projects = [
    "sobat-takwa",
    "cihuy-movie",
    "design-to-code",
    "we-share",
    "toyota-labuhanbatu",
    "gemini-fine-tuning-studio",
    "instacook",
    "saas-notesapp",
    "hadith-api",
    "aku-mahasigma",
    "2",
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:video="http://www.google.com/schemas/sitemap-video/1.1">
  ${staticPages
    .map((page) => {
      const url = `${siteUrl}${page}`;
      const priority = page === "" ? "1.0" : "0.8";
      const changefreq = page === "" ? "weekly" : "monthly";

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
    })
    .join("")}
  ${blogPosts
    .map((post) => {
      const url = `${siteUrl}/blog/${post.slug}`;
      const lastmod = post.data.publishedAt
        ? new Date(post.data.publishedAt).toISOString()
        : new Date().toISOString();

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
    })
    .join("")}
  ${projects
    .map((project) => {
      const url = `${siteUrl}/projects/${project}`;

      return `
  <url>
    <loc>${url}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
    })
    .join("")}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600", // Cache for 1 hour
    },
  });
};
