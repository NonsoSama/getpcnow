// Supabase Edge Function "notify": emails every subscriber about ONE laptop added from /admin.
// Same email design as scripts/notify-new-listings.mjs.
// Deploy:   supabase functions deploy notify
// Secrets:  supabase secrets set RESEND_API_KEY=re_xxx MAIL_FROM="getpcnow <news@getpcnow.shop>"
// (SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY are provided automatically. No secret ever reaches the browser.)
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";

const SITE = (Deno.env.get("SITE") ?? "https://getpcnow.shop").replace(/\/$/, "");
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, apikey, content-type, x-client-info" };
const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

// admin prices are already in each country's own money, so no exchange rate is needed
function prices(p: any) {
  const out: string[] = [];
  if (p.pr?.GH) out.push("Ghana GH₵" + Number(p.pr.GH).toLocaleString("en-GH"));
  if (p.pr?.NG) out.push("Nigeria ₦" + Number(p.pr.NG).toLocaleString("en-NG"));
  return out.join(" · ");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (o: unknown, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { ...cors, "Content-Type": "application/json" } });
  try {
    for (const k of ["RESEND_API_KEY", "MAIL_FROM"]) if (!Deno.env.get(k)) return json({ error: `Missing secret ${k}` }, 500);

    // 1. the caller must be a logged-in admin
    const asUser = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: req.headers.get("Authorization") ?? "" } } });
    const { data: ok } = await asUser.rpc("is_admin");
    if (!ok) return json({ error: "not an admin" }, 403);

    // 2. load the laptop and the subscribers. {test:true} sends ONLY to the admin who pressed the button and does not mark it as sent.
    const { id, test } = await req.json();
    const { data: me } = await asUser.auth.getUser();
    const db = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data: row } = await db.from("added").select("*").eq("id", id).single();
    if (!row) return json({ error: "listing not found" }, 404);
    if (row.notified_at && !test) return json({ error: "already notified" }, 409);
    const { data: real } = test ? { data: null } : await db.from("subscribers").select("email,token").limit(100000);
    const subs = test ? [{ email: me.user!.email!, token: "00000000-0000-0000-0000-000000000000" }] : real;

    const p = row.data, link = `${SITE}/laptop/${slug(p.n)}`, spec = (p.s ?? []).join(" | ");
    const subject = (test ? "[TEST] " : "") + `New laptop added: ${p.n}`;
    const html = (u: string) => `<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;padding:20px">
 <div style="font-size:22px;font-weight:800;color:#111">getpcnow</div>
 <p style="font-size:16px;color:#111">A new laptop was just added:</p>
 <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="padding:16px 0;border-bottom:1px solid #e5e5e5">
  <div style="font-size:18px;font-weight:700;color:#111">${esc(p.n)} <span style="font-size:12px;font-weight:600;color:#555;background:#f1f1f1;border-radius:6px;padding:2px 7px">${esc(p.c)}</span></div>
  <div style="font-size:14px;color:#555;margin:4px 0">${esc(spec)}</div>
  <div style="font-size:14px;color:#555;margin:0 0 8px">Good for: ${esc((p.u ?? []).join(", "))}</div>
  <div style="font-size:16px;font-weight:700;color:#111;margin-bottom:10px">${esc(prices(p))}</div>
  <a href="${link}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:10px 18px;border-radius:10px">See this laptop</a>
 </td></tr></table>
 <p style="font-size:12px;color:#777;margin:22px 0 14px">Prices are ballpark figures from Jiji listings and change often. Check the seller page before you pay.<br>You get this because you asked for new-laptop updates on getpcnow.</p>
 <a href="${u}" style="display:inline-block;border:1.5px solid #bbb;color:#444;text-decoration:none;font-weight:700;font-size:13px;padding:9px 16px;border-radius:10px">Unsubscribe</a></div>`;
    const text = (u: string) => `${subject}\n\n${p.n} (${p.c})\n${spec}\n${prices(p)}\n${link}\n\nUnsubscribe: ${u}\n`;

    // 3. send in batches of 100 (Resend batch limit)
    const mails = (subs ?? []).map((s) => {
      const u = `${SITE}/unsubscribe?t=${s.token}`;
      return { from: Deno.env.get("MAIL_FROM"), to: [s.email], subject, html: html(u), text: text(u), headers: { "List-Unsubscribe": `<${u}>` } };
    });
    for (let i = 0; i < mails.length; i += 100) {
      const r = await fetch("https://api.resend.com/emails/batch", { method: "POST",
        headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
        body: JSON.stringify(mails.slice(i, i + 100)) });
      if (!r.ok) return json({ error: "Resend: " + await r.text(), sent: i }, 502);
    }
    if (!test) await db.from("added").update({ notified_at: new Date().toISOString() }).eq("id", id);
    return json({ sent: mails.length, test: !!test });
  } catch (e) { return json({ error: String(e) }, 500); }
});
