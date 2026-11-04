import type { APIRoute } from 'astro';

const routes = ['/', '/work', '/services', '/ai-lab', '/founders', '/ecosystem', '/start', '/legal'];

export const GET: APIRoute = () => {
  const urls = routes
    .map((r) => `  <url><loc>https://veeramisir.com${r}</loc><changefreq>${r === '/' ? 'weekly' : 'monthly'}</changefreq></url>`)
    .join('\n');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8', 'Cache-Control': 'public, max-age=3600' },
  });
};
