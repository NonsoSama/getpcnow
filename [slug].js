/* POST /api/views/<slug>  ->  adds 1 to that article's count and returns {"n": 43} */
const json = (o, status = 200) =>
  new Response(JSON.stringify(o), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });

const MAX_ARTICLES = 200; // stops anyone from filling the table with made-up names

export async function onRequestPost({ request, params, env }) {
  const slug = String(params.slug || "");
  if (!/^[a-z0-9-]{1,80}$/.test(slug)) return json({ error: "bad slug" }, 400);

  // only our own website may add views
  const origin = request.headers.get("Origin");
  if (origin && origin !== new URL(request.url).origin) return json({ error: "forbidden" }, 403);

  try {
    const known = await env.DB.prepare("SELECT 1 AS x FROM views WHERE slug = ?").bind(slug).first();
    if (!known) {
      const { c } = await env.DB.prepare("SELECT COUNT(*) AS c FROM views").first();
      if (c >= MAX_ARTICLES) return json({ error: "too many articles" }, 400);
    }
    const row = await env.DB
      .prepare("INSERT INTO views (slug, n) VALUES (?, 1) ON CONFLICT(slug) DO UPDATE SET n = n + 1 RETURNING n")
      .bind(slug)
      .first();
    return json({ n: row.n });
  } catch (e) {
    return json({ error: "server error" }, 500);
  }
}
