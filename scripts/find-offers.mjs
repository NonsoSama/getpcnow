// getpcnow offer finder. Runs on GitHub Actions after the listing checker.
// For every laptop in data.js it opens the Jumia and Jiji search page for each country, reads the products
// it finds, and keeps the ones that are really discounted. Result: offers-auto.js  (var AUTO=[...]).
//
// How "gone" works here: the file is REBUILT on every run from what the sellers show today.
// A laptop that is no longer listed simply does not come back, so its offer disappears by itself.
// If a page cannot be read (blocked, error, 0 products parsed) the old offers for it are kept, not wiped,
// and the site hides any auto offer older than 5 days on its own.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const MIN_OFF = +(process.env.MIN_OFF || 0.10);       // smallest discount worth showing (0.10 = 10%)
const DELAY_MS = +(process.env.DELAY_MS || 1500);
const FIXTURE_DIR = process.env.FIXTURE_DIR || "";    // tests only: read saved pages instead of the internet
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";

const dataFile = [process.env.DATA_FILE, "data.js", "js/data.js"].filter(Boolean).find(f => fs.existsSync(f));
if (!dataFile) { console.error("Could not find data.js"); process.exit(1); }
const outFile = path.join(path.dirname(dataFile), "offers-auto.js");

const ctx = { window: {}, document: {} }; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(dataFile, "utf8") + "\n;globalThis.__D={P,SELL,RATE};", ctx);
const { P, SELL, RATE } = ctx.__D;

const sleep = ms => new Promise(r => setTimeout(r, ms));
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const num = t => { const m = String(t || "").replace(/&nbsp;/g, " ").match(/\d[\d,]*(?:\.\d+)?/); return m ? Math.round(parseFloat(m[0].replace(/,/g, ""))) : 0; };
const text = h => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&amp;/g, " ").replace(/\s+/g, " ").trim();

// A product title must contain every key word of the laptop name (brand words and "gen" are ignored).
// Override per laptop by adding  match:["thinkpad","t14"]  in data.js.
const SKIP = new Set(["apple", "lenovo", "dell", "hp", "acer", "asus", "gen", "gaming"]);
const keys = p => p.match || slug(p.n).split("-").filter(w => w.length > 1 && !SKIP.has(w));
const fits = (title, p) => { const t = title.toLowerCase().replace(/[^a-z0-9]+/g, " "); return keys(p).every(k => t.split(" ").includes(k)); };

// ---- page readers: each returns [{title, price, old, url}] ----
function readJumia(html, base) {
  return html.split("<article").slice(1).map(b => {
    const href = (b.match(/<a[^>]+class="[^"]*\bcore\b[^"]*"[^>]*href="([^"]+)"/) || b.match(/<a[^>]+href="([^"]+\.html[^"]*)"/) || [])[1];
    const title = text((b.match(/<h3[^>]*class="[^"]*name[^"]*"[^>]*>([\s\S]*?)<\/h3>/) || b.match(/class="name"[^>]*>([\s\S]*?)</) || [])[1] || "");
    const price = num((b.match(/class="[^"]*\bprc\b[^"]*"[^>]*>([\s\S]*?)<\/div>/) || [])[1]);
    const old = num((b.match(/class="[^"]*\bold\b[^"]*"[^>]*>([\s\S]*?)<\/div>/) || [])[1]);
    return href && title && price ? { title, price, old, url: new URL(href.split("#")[0], base).href } : null;
  }).filter(Boolean);
}
function readJiji(html, base) {      // best effort: Jiji shows one price and no old price
  const out = [], re = /<a[^>]+href="([^"]+\.html[^"]*)"[^>]*>([\s\S]*?)<\/a>/g; let m;
  while ((m = re.exec(html))) {
    const t = text(m[2]), pm = t.match(/(?:₦|GH₵|GH¢|GHS)\s?\d[\d,]*/);
    if (!pm) continue;
    out.push({ title: t.slice(0, pm.index).trim() || t, price: num(pm[0]), old: 0, url: new URL(m[1].split("?")[0] + "", base).href });
  }
  return out;
}
const READ = { Jumia: readJumia, Jiji: readJiji };

let why = "";   // the last reason a page could not be read, shown in the log
async function page(src, c, p, base) {
  if (FIXTURE_DIR) { const f = path.join(FIXTURE_DIR, `${src}-${c}.html`); return fs.existsSync(f) ? fs.readFileSync(f, "utf8") : null; }
  const url = base + encodeURIComponent(p.n);
  for (let i = 0; i < 2; i++) {
    try {
      const r = await fetch(url, { headers: { "User-Agent": UA, "Accept": "text/html", "Accept-Language": "en" }, signal: AbortSignal.timeout(20000) });
      if (!r.ok) why = "HTTP " + r.status + (r.status === 403 || r.status === 429 ? " (seller is blocking this computer)" : "");
      else { const b = await r.text(); if (/captcha|access denied|just a moment|verify you are human/i.test(b)) why = "bot check page"; else return b; }
    } catch (e) { why = "network error: " + e.message; }
    await sleep(3000);
  }
  return null;
}

// Keep old offers if a page could not be read.
const prev = (() => { try { const c = { }; vm.createContext(c); vm.runInContext(fs.readFileSync(outFile, "utf8") + ";globalThis.__A=AUTO", c); return c.__A || []; } catch { return []; } })();
const today = new Date().toISOString().slice(0, 10);
const out = []; let read = 0, failed = 0;

for (const c of Object.keys(SELL)) {
  const cur = n => c === "GH" ? Math.round(n * RATE) : n;                 // laptop prices in data.js are naira
  for (const [src, base] of SELL[c]) {
    for (const p of P) {
      if (src === "Jumia" && p.c !== "New") continue;                     // same rule as the buy buttons
      const html = await page(src, c, p, base); await sleep(FIXTURE_DIR ? 0 : DELAY_MS);
      const all = html ? READ[src](html, base) : [], items = all.filter(i => fits(i.title, p));
      if (!all.length) {   // blocked, error, or the page layout changed: we learned nothing, so keep what we had
        failed++; const keep = prev.filter(o => o.n === p.n && o.c === c && o.src === src);
        out.push(...keep); console.log(`skip   ${c} ${src} ${p.n}: ${html ? "page had no products we could read" : "page not readable - " + why} (kept ${keep.length} old)`); continue;
      }
      read++;   // the page was read fine. If our laptop is not on it, it is gone and its old offer is dropped.
      // Reference price. Never trust an old price above the top of the range we know (fake "was" prices).
      const top = cur(p.hi), typ = cur(p.t), floor = cur(p.lo) * 0.5;
      let best = null;
      for (const i of items) {
        const was = src === "Jumia" && i.old > i.price ? Math.min(i.old, top) : typ;
        const off = 1 - i.price / was;
        if (i.price < floor || off < MIN_OFF) continue;                   // too cheap = wrong item or scam; too small = not a deal
        if (!best || off > best.off) best = { off, was, now: i.price, url: i.url };
      }
      if (best) { out.push({ n: p.n, c, was: best.was, now: best.now, src, url: best.url, upd: today, auto: 1 }); console.log(`OFFER  ${c} ${src} ${p.n}: ${Math.round(best.off * 100)}% off, ${best.now}`); }
      else console.log(`none   ${c} ${src} ${p.n}: ${items.length} listed, none discounted`);
    }
  }
}
if (!read && failed) { console.error("No search page could be read. Leaving offers-auto.js unchanged. The sellers may be blocking GitHub's servers."); process.exit(0); }
fs.writeFileSync(outFile, "/* Written automatically by scripts/find-offers.mjs. Do not edit. */\nvar AUTO=" + JSON.stringify(out, null, 0).replace(/},/g, "},\n") + ";\n");
console.log(`Done: ${out.length} offer(s) written. ${read} page(s) read, ${failed} not readable.`);
