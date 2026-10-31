/* getpcnow: email subscribers when you add a new laptop to data.js.  Run:  node scripts/notify-new-listings.mjs
   How it knows what is new: it compares the laptops in data.js with known-listings.json (the laptops already announced).
   FIRST RUN: it only creates known-listings.json from your current laptops and sends nothing. After that, any laptop
   you add to data.js is "new" the next time the script runs. It sends ONE email per subscriber (a digest if you added several).
   Test first with:  node scripts/notify-new-listings.mjs --dry   (prints what it would send, sends nothing)

   Needs Node 18+ and these settings (environment variables, NEVER written into any file on the website):
     SUPABASE_URL          https://bcfspmezuuanhmxndjsq.supabase.co
     SUPABASE_SERVICE_KEY  the SECRET (service_role) key. It can read the subscribers table.
     RESEND_API_KEY        from resend.com (free tier is fine to start). Verify your sending domain there.
     MAIL_FROM             e.g.  getpcnow <news@getpcnow.shop>   (must be on the domain you verified)
     SITE                  optional, defaults to https://getpcnow.shop */
import fs from "node:fs";
import vm from "node:vm";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const dry = process.argv.includes("--dry");
const SITE = (process.env.SITE || "https://getpcnow.shop").replace(/\/$/, "");
const KNOWN = path.join(root, "known-listings.json");

/* read the laptop list (P) and the exchange rate straight out of data.js */
const ctx = {};
vm.runInNewContext(fs.readFileSync(path.join(root, "data.js"), "utf8") + "\n;this.P=P;this.RATE=RATE;", ctx);
const laptops = ctx.P, RATE = ctx.RATE;
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ghc = n => "GH₵" + (Math.round(n * RATE / 10) * 10).toLocaleString("en-GH");
const ngn = n => "₦" + Math.round(n).toLocaleString("en-NG");

const known = fs.existsSync(KNOWN) ? JSON.parse(fs.readFileSync(KNOWN, "utf8")) : null;
if (!known) {
  fs.writeFileSync(KNOWN, JSON.stringify(laptops.map(p => p.n), null, 1) + "\n");
  console.log(`First run: saved ${laptops.length} current laptops to known-listings.json. No emails sent.`);
  process.exit(0);
}
const fresh = laptops.filter(p => !known.includes(p.n));
if (!fresh.length) { console.log("No new laptops. Nothing to send."); process.exit(0); }
console.log("New laptops:", fresh.map(p => p.n).join(", "));

function prices(p) {
  const cn = p.cn || ["GH", "NG"], out = [];
  if (cn.includes("GH")) out.push("Ghana " + ghc(p.t));
  if (cn.includes("NG")) out.push("Nigeria " + ngn(p.t));
  return out.join(" · ");
}
function card(p) {
  const [scr, ram, ssd, cpu, gpu] = p.s;
  return `<tr><td style="padding:16px 0;border-bottom:1px solid #e5e5e5">
   <div style="font-size:18px;font-weight:700;color:#111">${esc(p.n)} <span style="font-size:12px;font-weight:600;color:#555;background:#f1f1f1;border-radius:6px;padding:2px 7px">${esc(p.c)}</span></div>
   <div style="font-size:14px;color:#555;margin:4px 0">${esc([scr, ram, ssd, cpu, gpu].join(" | "))}</div>
   <div style="font-size:14px;color:#555;margin:0 0 8px">Good for: ${esc((p.u || []).join(", "))}</div>
   <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:10px">${esc(prices(p))}</div>
   <a href="${SITE}/laptop/${slug(p.n)}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:10px 18px;border-radius:10px">See this laptop</a>
  </td></tr>`;
}
const subject = fresh.length === 1 ? `New laptop added: ${fresh[0].n}` : `${fresh.length} new laptops added on getpcnow`;
const html = unsub => `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:20px">
 <div style="font-size:22px;font-weight:800;color:#111">getpcnow</div>
 <p style="font-size:16px;color:#111">${fresh.length === 1 ? "A new laptop was just added:" : "New laptops were just added:"}</p>
 <table width="100%" cellpadding="0" cellspacing="0">${fresh.map(card).join("")}</table>
 <p style="font-size:12px;color:#777;margin-top:22px">Prices are ballpark figures from Jiji listings and change often. Check the seller page before you pay.<br>
 You get this because you asked for new-laptop updates on getpcnow. <a href="${unsub}" style="color:#777">Unsubscribe</a></p></div>`;
const text = unsub => `${subject}\n\n` + fresh.map(p => `${p.n} (${p.c})\n${p.s.join(" | ")}\n${prices(p)}\n${SITE}/laptop/${slug(p.n)}\n`).join("\n") + `\nUnsubscribe: ${unsub}\n`;

if (dry) {
  console.log("\n--dry: subject would be:", subject, "\n\n" + text(`${SITE}/unsubscribe?t=EXAMPLE-TOKEN`));
  process.exit(0);
}

for (const k of ["SUPABASE_URL", "SUPABASE_SERVICE_KEY", "RESEND_API_KEY", "MAIL_FROM"])
  if (!process.env[k]) { console.error(`Missing setting: ${k} (see the top of this file)`); process.exit(1); }

const sb = { apikey: process.env.SUPABASE_SERVICE_KEY, Authorization: "Bearer " + process.env.SUPABASE_SERVICE_KEY };
const res = await fetch(`${process.env.SUPABASE_URL}/rest/v1/subscribers?select=email,token&limit=100000`, { headers: sb });
if (!res.ok) { console.error("Could not read subscribers:", res.status, await res.text()); process.exit(1); }
const subs = await res.json();
console.log(`Sending to ${subs.length} subscriber(s)...`);

let failed = 0;
for (let i = 0; i < subs.length; i += 100) {            /* Resend batch endpoint: up to 100 emails per request */
  const chunk = subs.slice(i, i + 100).map(s => {
    const u = `${SITE}/unsubscribe?t=${s.token}`;
    return { from: process.env.MAIL_FROM, to: [s.email], subject, html: html(u), text: text(u),
      headers: { "List-Unsubscribe": `<${u}>` } };
  });
  const r = await fetch("https://api.resend.com/emails/batch", { method: "POST",
    headers: { Authorization: "Bearer " + process.env.RESEND_API_KEY, "Content-Type": "application/json" }, body: JSON.stringify(chunk) });
  if (!r.ok) { failed += chunk.length; console.error("Batch failed:", r.status, await r.text()); }
}
if (failed) { console.error(`${failed} email(s) failed. known-listings.json NOT updated, so you can run it again.`); process.exit(1); }
fs.writeFileSync(KNOWN, JSON.stringify(laptops.map(p => p.n), null, 1) + "\n");
console.log("Done. known-listings.json updated.");
