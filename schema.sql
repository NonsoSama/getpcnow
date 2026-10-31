CREATE TABLE IF NOT EXISTS views (
  slug TEXT PRIMARY KEY,
  n    INTEGER NOT NULL DEFAULT 0
);

/* ---- New-listing email signups (header bell). Run this once in Supabase: SQL Editor > New query > Run ---- */
CREATE TABLE IF NOT EXISTS subscribers (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email      TEXT NOT NULL,
  token      UUID NOT NULL DEFAULT gen_random_uuid(),   -- used in the unsubscribe link
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS subscribers_email_key ON subscribers (lower(email));  -- same email twice = 409, handled by the site

ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
-- visitors (the publishable key) may ADD a row, and nothing else: they cannot read or change anyone's email
DROP POLICY IF EXISTS "visitors can subscribe" ON subscribers;
CREATE POLICY "visitors can subscribe" ON subscribers FOR INSERT TO anon WITH CHECK (true);

-- the unsubscribe link calls this. It only deletes the row that matches the secret token from the email.
CREATE OR REPLACE FUNCTION unsubscribe(t UUID) RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE n INT;
BEGIN
  DELETE FROM subscribers WHERE token = t;
  GET DIAGNOSTICS n = ROW_COUNT;
  RETURN n > 0;
END $$;
REVOKE ALL ON FUNCTION unsubscribe(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION unsubscribe(UUID) TO anon;

-- the old price_alerts table is no longer used by the site. Delete it once you have no need for its rows:
-- DROP TABLE IF EXISTS price_alerts;
