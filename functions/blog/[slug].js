const SITE = "https://getpcnow.shop";
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const absUrl = (u) => (/^https?:\/\//.test(u) ? u : SITE + encodeURI(u.charAt(0) === "/" ? u : "/" + u));

function field(chunk, name) {
  const m = chunk.match(new RegExp("(?:^|[\\s,{])" + name + '\\s*:\\s*"((?:[^"\\\\]|\\\\.)*)"'));
  if (!m) return "";
  try { return JSON.parse('"' + m[1] + '"'); } catch (e) { return m[1]; }
}

function listPosts(src) {
  const end = src.indexOf("var BY=");
  const text = end > 0 ? src.slice(0, end) : src;
  const hits = [...text.matchAll(/slug\s*:\s*"([^"]+)"/g)];
  return hits.map((m, i) => {
    const chunk = text.slice(m.index, i + 1 < hits.length ? hits[i + 1].index : text.length);
    return { slug: m[1], title: field(chunk, "title"), excerpt: field(chunk, "excerpt"), summary: field(chunk, "summary"), img: field(chunk, "img") };
  });
}

function inject(html, p) {
  const url = SITE + "/blog/" + p.slug;
  const title = p.title + " – getpcnow";
  const desc = p.summary || p.excerpt || "";
  const img = absUrl(p.img || "images/hero.jpg");
  html = html.replace(/<title>[\s\S]*?<\/title>/, "<title>" + esc(title) + "</title>");
  html = html.replace(/<meta\s+name="description"[^>]*>/, '<meta name="description" content="' + esc(desc) + '">');
  html = html.replace(/<meta\s+(?:property|name)="(?:og|twitter):[^>]*>\s*/g, "");
  html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/, "");
  const tags = [
    '<link rel="canonical" href="' + url + '">',
    '<meta property="og:type" content="article">',
    '<meta property="og:site_name" content="getpcnow">',
    '<meta property="og:title" content="' + esc(p.title) + '">',
    '<meta property="og:description" content="' + esc(desc) + '">',
    '<meta property="og:url" content="' + url + '">',
    '<meta property="og:image" content="' + esc(img) + '">',
    '<meta name="twitter:card" content="summary_large_image">',
    '<meta name="twitter:title" content="' + esc(p.title) + '">',
    '<meta name="twitter:description" content="' + esc(desc) + '">',
    '<meta name="twitter:image" content="' + esc(img) + '">',
  ].join("\n");
  return html.replace("</head>", tags + "\n</head>");
}

export async function onRequestGet({ request, params, env }) {
  const url = new URL(request.url);
  const page = await env.ASSETS.fetch(new Request(new URL("/", url)));
  let html = await page.text();
  let status = 200;
  try {
    const src = await (await env.ASSETS.fetch(new Request(new URL("/blog.js", url)))).text();
    const posts = listPosts(src);
    const p = posts.find((x) => x.slug === String(params.slug));
    if (p) html = inject(html, p);
    else if (posts.length) status = 404;
  } catch (e) { }
  return new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "public, max-age=300" } });
}