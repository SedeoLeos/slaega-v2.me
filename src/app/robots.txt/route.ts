/**
 * robots.txt served as an explicit Route Handler (not the `robots.ts` metadata
 * convention) — same reliability rationale as the sitemap route handler.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://slaega.com";

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "anthropic-ai",
  "Claude-Web",
  "Omgilibot",
  "FacebookBot",
  "ia_archiver",
];

export async function GET() {
  const body = `# slaega — Seba Gedeon Matsoula Malonga
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

${AI_BOTS.map((ua) => `User-agent: ${ua}`).join("\n")}
Disallow: /

Host: ${BASE}
Sitemap: ${BASE}/sitemap.xml
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
