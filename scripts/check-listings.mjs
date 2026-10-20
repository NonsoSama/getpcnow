// getpcnow listing checker. Runs on GitHub Actions (see .github/workflows/check-listings.yml).
// Visits every exact listing link in data.js, works out if the ad is gone, and writes dead.js.
// The site reads dead.js: dead links fall back to the Jiji search, dead offers vanish, and
// laptops marked  ad:true  (they exist only for one listing) are hidden.
// It only acts after several failed checks in a row, and never on "blocked" or "unsure" results.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const STRIKES = +(process.env.STRIKES || 3);          // consecutive "gone" checks before removal
const DELAY_MS = +(process.env.DELAY_MS || 1500);     // pause between requests, so we look less like a bot
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const extra = (process.env.EXTRA_GONE || "").split("|").map(s => s.trim().toLowerCase()).filter(Boolean);
// Words that mean "this ad is dead" on a page that still loads. Add the exact wording you see on a sold ad
// here, or set EXTRA_GONE="phrase one|phrase two" in the workflow without touching the code.
const GONE = ["no longer available", "ad has been removed", "ad is not available", "ad was removed", "ad has expired", ...extra];
// Words that mean "a bot check, not the real page". These are never counted as dead.
const BLOCK = ["captcha", "access denied", "just a moment", "verify you are human", "unusual traffic"];

const dataFile = [process.env.DATA_FILE, "data.js", "js/data.js"].filter(Boolean).find(f => fs.existsSync(f));
if (!dataFile) { console.error("Could not find data.js"); process.exit(1); }
const dir = path.dirname(dataFile);
const statusFile = path.join(dir, "listing-status.json");
const deadFile = path.join(dir, "dead.js");

// Works whether data.js uses  var P=...  or  const P=...  (const/let do not show up on the context object).
const ctx = { window: {}, document: {} }; vm.createContext(ctx);
try {
  vm.runInContext(
    fs.readFileSync(dataFile, "utf8") +
    "\n;globalThis.__P = typeof P !== 'undefined' ? P : []; globalThis.__O = typeof OFFERS !== 'undefined' ? OFFERS : [];",
    ctx
  );
} catch (e) { console.error("data.js could not be read by the checker: " + e.message); process.exit(1); }

const clean = u => (/\.html\?/.test(u) ? u.split("?")[0] : u);
const strings = o => typeof o === "string" ? [o] : o && typeof o === "object" ? Object.values(o).flatMap(strings) : [];
const urls = [...new Set([
  ...(ctx.__P || []).flatMap(p => strings(p.url)),
  ...(ctx.__O || []).map(o => o && o.url)
].filter(u => typeof u === "string" && /^https?:\/\//.test(u)).map(clean))];

// Nothing to check is normal (no hand-added links yet). Write empty results so the site and the workflow keep working.
if (!urls.length) {
  fs.writeFileSync(statusFile, "{}\n");
  fs.writeFileSync(deadFile, "/* Written automatically by scripts/check-listings.mjs. Do not edit. */\nvar DEAD=[];\n");
  console.log("No hand-added listing links in data.js (OFFERS or url fields). Nothing to check.");
  process.exit(0);
}

const idOf = u => (u.match(/([^\/]+?)\.html$/) || [])[1] || null;
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchOnce(url) {
  return fetch(url, { redirect: "follow", headers: { "User-Agent": UA, "Accept": "text/html", "Accept-Language": "en" }, signal: AbortSignal.timeout(20000) });
}

async function check(url) {
  let res;
  try { res = await fetchOnce(url); }
  catch (e) {
    await sleep(3000);                                   // one retry for a flaky connection
    try { res = await fetchOnce(url); }
    catch (e2) { return { s: "unsure", why: "network error: " + e2.message }; }
  }
  if (res.status === 404 || res.status === 410) return { s: "gone", why: "HTTP " + res.status };
  if (!res.ok) return { s: "unsure", why: "HTTP " + res.status + " (blocked or server error)" };
  const body = await res.text(), low = body.toLowerCase(), id = idOf(url);
  if (BLOCK.some(p => low.includes(p))) return { s: "unsure", why: "bot check page" };
  if (GONE.some(p => low.includes(p))) return { s: "gone", why: "page says the ad is gone" };
  if (id && !body.includes(id) && !res.url.includes(id)) return { s: "gone", why: "redirected away from the listing" };
  return { s: "live", why: "ok" };
}

const state = fs.existsSync(statusFile) ? JSON.parse(fs.readFileSync(statusFile, "utf8")) : {};
const results = {};
for (const u of urls) { results[u] = await check(u); console.log(results[u].s.padEnd(6), results[u].why, "-", u); await sleep(DELAY_MS); }

const count = s => Object.values(results).filter(r => r.s === s).length;
const goneCount = count("gone"), unsureCount = count("unsure");

// Safety net: if every link (3 or more) looks gone at once, the checker is probably blocked. Change nothing.
const suspicious = urls.length >= 3 && goneCount === urls.length;
if (suspicious) console.log("All listings look gone at once. Treating this as a checker problem and ignoring this run.");
// Visibility: if most checks were inconclusive, the checker can't really see Jiji/Jumia from GitHub's servers.
if (unsureCount / urls.length > 0.5) console.log(`WARNING: ${unsureCount} of ${urls.length} checks were inconclusive (blocked or errors). Removal will not work reliably until this improves.`);

const next = {};
for (const u of urls) {
  const prev = state[u] || { fails: 0 }, r = results[u];
  let fails = prev.fails;
  if (r.s === "live") fails = 0;
  else if (r.s === "gone" && !suspicious) fails = prev.fails + 1;
  next[u] = { fails, last: r.s, why: r.why, checked: new Date().toISOString().slice(0, 10) };
}
const dead = urls.filter(u => next[u].fails >= STRIKES).sort();
fs.writeFileSync(statusFile, JSON.stringify(next, null, 1) + "\n");
fs.writeFileSync(deadFile, "/* Written automatically by scripts/check-listings.mjs. Do not edit. */\nvar DEAD=" + JSON.stringify(dead) + ";\n");
console.log(`Checked ${urls.length} listing(s): ${count("live")} live, ${goneCount} gone, ${unsureCount} unsure. Dead (removed from site): ${dead.length}.`);
