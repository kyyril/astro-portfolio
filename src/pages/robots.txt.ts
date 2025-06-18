import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() || 'https://kyyril.pages.dev';
  
  const robotsTxt = `User-agent: *
Allow: /

# Disallow admin and API routes
Disallow: /api/
Disallow: /admin/
Disallow: /_astro/
Disallow: /dist/

# Allow important files
Allow: /api/sitemap.xml
Allow: /favicon.svg
Allow: /global.css

# Crawl delay (optional, be respectful)
Crawl-delay: 1

# Sitemap location
Sitemap: ${siteUrl}/sitemap.xml

# Additional directives for specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

# Block AI training bots (optional)
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: CCBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: Claude-Web
Disallow: /`;

  return new Response(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
    },
  });
};
