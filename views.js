/* GET /api/views  ->  {"ram-8-vs-16": 42, "used-laptop-checklist": 17, ...}
   Cloudflare Pages Function. Needs a D1 database bound as DB (see SETUP-CLOUDFLARE.md). */
const json = (o, status = 200, extra = {}) =>
  new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json", ...extra } });

export async function onRequestGet({ env }) {
  try {
    const { results } = await env.DB.prepare("SELECT slug, n FROM views").all();
    const out = {};
    for (const r of results) out[r.slug] = r.n;
    return json(out, 200, { "Cache-Control": "public, max-age=30" });
  } catch (e) {
    return json({}, 500, { "Cache-Control": "no-store" });
  }
}
