getpcnow - how the site is organised
====================================

FILES THE SITE LOADS (index.html loads these, all sitting beside index.html)
  index.html        The page shell. You rarely need to touch this.
  style.css         All the styling. Change --acc at the top to recolour the site.
  data.js           YOUR FILE TO EDIT: laptops (P), prices, sellers (SELL), extra
                    configurations (VARS), performance ratings, social links (SOCIALS).
  dead.js           List of seller links the checker found gone. Dead links are hidden.
  offers-auto.js    Offers found automatically. Offers older than 5 days are hidden.
  art.js            Placeholder drawings and icons.
  alerts.js         The "Get a price alert" popup (bell button). Saves to Supabase.
  app.js            The page logic (lists, laptop pages, footer). Edit only to change behaviour.
  images/           Put your real photos here (they cover the placeholders automatically):
    hero.jpg, all.jpg
    students.jpg, programmers.jpg, gamers.jpg, creators.jpg, home-work.jpg
    macbook-deals.jpg, windows-deals.jpg, linux-deals.jpg
  images/laptops/   One photo per laptop, named after it in lowercase with hyphens,
                    e.g. apple-macbook-air-m2.jpg, acer-nitro-v-15.jpg

  Note: if you prefer css/ and js/ folders, move the files into them AND change the
  <link> and <script> paths in index.html to match. They must agree or the site breaks.

PRICE ALERTS (the bell button)
  - The bell always looks the same and always opens the popup, so one visitor can set
    alerts with more than one email.
  - Each email + laptop pair can only be saved once. A repeat shows
    "This email is already used for this laptop" inside the popup.
  - Saved rows go to the Supabase table price_alerts:
    email, laptop, country, price_at_signup (naira-equivalent), created_at.
  - alerts.js holds ONLY the publishable key (safe to be public). NEVER put the
    secret key in any file that goes on the website.
  - If a save fails, the popup shows an error number. Press F12 > Console to see
    the full reason from Supabase.

  Supabase setup (SQL editor). Skip anything you already did:
    create table if not exists price_alerts (
      id bigint generated always as identity primary key,
      created_at timestamptz default now(),
      email text not null, laptop text not null,
      country text, price_at_signup integer);
    alter table price_alerts enable row level security;
    create policy "visitors can add alerts" on price_alerts
      for insert to anon with check (true);
    create unique index if not exists price_alerts_email_laptop_uq
      on price_alerts (lower(email), laptop);
  The unique index is what makes repeat emails get rejected. If it errors, the table
  already has duplicate rows: delete the duplicates, then run it again.

PRICE-DROP EMAILS (email/ folder, NOT uploaded to the website)
  email/price-drop-email.html   The email visitors will receive. {{double-brace}} words
                                are filled in when it is sent.
  email/preview.html            The same email with sample values. Double-click to view.
  email/send-test-email.js      Sends the sample email to YOUR inbox. Instructions are
                                at the top of the file (uses a free Resend account).
  Not built yet: the sender that checks prices and emails real subscribers, and the
  unsubscribe page/link. The popup promises an unsubscribe link, so build that before
  you email anyone for real.

To go live: upload the site files and images/ folder to your host, keeping them together.
Do not upload the email/ folder.
