import { createFileRoute } from "@tanstack/react-router";
import { GUIDES } from "@/content/guides";
import { LESSONS } from "@/lib/lesson-curriculum";
import { SITE_URL, STATIC_PATHS } from "@/lib/site";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const base = SITE_URL || new URL(request.url).origin;
        const urls: { path: string; lastmod?: string }[] = [
          ...STATIC_PATHS.map((path) => ({ path })),
          ...LESSONS.map((lesson) => ({ path: `/lessons/${lesson.id}` })),
          ...GUIDES.map((guide) => ({
            path: `/resources/${guide.slug}`,
            lastmod: guide.updated,
          })),
        ];

        const body = urls
          .map((url) => {
            const loc = escapeXml(`${base}${url.path}`);
            const lastmod = url.lastmod
              ? `\n    <lastmod>${escapeXml(url.lastmod)}</lastmod>`
              : "";
            return `  <url>\n    <loc>${loc}</loc>${lastmod}\n  </url>`;
          })
          .join("\n");

        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;

        return new Response(xml, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
            "X-Content-Type-Options": "nosniff",
          },
        });
      },
    },
  },
});
