/* getpcnow ADMIN. Run once: Supabase > SQL Editor > New query > Run.
   Then: Authentication > Users > Add user (one per teammate), and turn OFF "Allow new users to sign up" (Authentication > Providers > Email).
   Then add each teammate's email below. */

CREATE TABLE IF NOT EXISTS admins (email TEXT PRIMARY KEY);
INSERT INTO admins (email) VALUES ('you@example.com') ON CONFLICT DO NOTHING;   -- <-- CHANGE to your login email, add teammates the same way

CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN
LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM admins WHERE lower(email) = lower(auth.jwt() ->> 'email')) $$;
GRANT EXECUTE ON FUNCTION is_admin() TO anon, authenticated;

ALTER TABLE admins ENABLE ROW LEVEL SECURITY;   -- no policies: nobody can read or edit it from the browser

/* delisted: key = laptop name exactly as in data.js, OR a full Jiji offer URL. country = ALL, GH or NG. Delete the row to relist. */
CREATE TABLE IF NOT EXISTS delisted (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'ALL' CHECK (country IN ('ALL','GH','NG')),
  note TEXT,
  created_by TEXT DEFAULT (auth.jwt() ->> 'email'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (key, country));

/* added: a laptop added from the admin page. data = same fields as a line in P (n, c, s, u, pr, cn, url, pro, con). */
CREATE TABLE IF NOT EXISTS added (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  data JSONB NOT NULL,
  notified_at TIMESTAMPTZ,
  created_by TEXT DEFAULT (auth.jwt() ->> 'email'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now());

ALTER TABLE delisted ENABLE ROW LEVEL SECURITY;
ALTER TABLE added ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON delisted;  CREATE POLICY "public read" ON delisted FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "public read" ON added;     CREATE POLICY "public read" ON added     FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin write" ON delisted;  CREATE POLICY "admin write" ON delisted FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
DROP POLICY IF EXISTS "admin write" ON added;     CREATE POLICY "admin write" ON added     FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

/* links: the Jiji listing a laptop's "Buy on Jiji" button opens, one per country. key = laptop name exactly as in data.js. Safe to re-run this whole file. */
CREATE TABLE IF NOT EXISTS links (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  key TEXT NOT NULL,
  country TEXT NOT NULL CHECK (country IN ('GH','NG')),
  url TEXT NOT NULL CHECK (url ~* '^https://(www\.)?(jiji\.com\.gh|jiji\.ng)/'),
  created_by TEXT DEFAULT (auth.jwt() ->> 'email'),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (key, country));
ALTER TABLE links ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public read" ON links;  CREATE POLICY "public read" ON links FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "admin write" ON links;  CREATE POLICY "admin write" ON links FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());
