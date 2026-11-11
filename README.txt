getpcnow - how the site is organised
====================================
Updated 10 Nov 2026

HOW THE SITE WORKS
  - index.html is only a shell. JavaScript (app.js, blog.js) draws every page.
  - Pages have real addresses, not /#/ ones:
      /                      home
      /all                   all laptops
      /students  /programmers  /gamers  /creators  /home-work     use pages
      /macbook-deals  /windows-deals  /linux-deals                deals pages
      /laptop/<laptop-name>  one laptop, e.g. /laptop/acer-nitro-5
      /tips                  Buying used
      /blog                  the blog, and /blog/<post-name> for each post
      /unsubscribe?t=...     the unsubscribe page (the link at the bottom of every email)
      /api/views             blog read counts (see BLOG READS below)
    Old links like getpcnow.shop/#/laptop/x are turned into the new address automatically.
  - Live at getpcnow.shop and www.getpcnow.shop on Cloudflare Pages. The code is on GitHub
    and Cloudflare redeploys by itself about a minute after you push from VS Code.
  - NEVER add a file called 404.html. Without it, Cloudflare Pages sends every address that
    is not a real file to index.html, which is what makes /blog/... and /laptop/... work.
  - The site must sit at the root of the domain: index.html loads /style.css, /app.js and so
    on with a leading slash. Double-clicking index.html will not work. Use VS Code Live
    Server, or push and test on the real site.
  - Dark mode: the moon/sun button in the header. The site follows the visitor's device
    setting until they press it, then remembers their choice.

FILES THE SITE LOADS (all sit in the site root, beside index.html)
  index.html        The page shell: title, link-preview tags, icons, fonts, and the list of
                    scripts. It also holds the mobile menu and back-to-top button code.
                    You rarely need to touch it. Scripts load in this order:
                    theme.js (in the head), then data.js, dead.js, offers-auto.js, art.js,
                    alerts.js, app.js, blog.js. Keep that order.
  style.css         All the main styling. Change --acc at the top to recolour the site.
  blog.css          Blog cards and article pages. Loads after style.css and uses its colours.
  dark.css          Loads last. The dark colours (change the variables at the top of the dark
                    block), the moon/sun and menu button styles, and the mobile header.
  theme.js          Loads first, in the head, so there is no white flash. Sets data-theme
                    "dark" or "light" on <html> and adds the moon/sun button to the header.
  data.js           YOUR FILE TO EDIT: laptops (P), prices, Jiji links, offers (OFFERS), extra
                    configurations (VARS), performance ratings, social links (SOCIALS).
                    More about it in the next section.
  dead.js           Seller links the checker found gone. Written automatically by
                    scripts/check-listings.mjs. Do not edit. Dead links are hidden, and a
                    laptop marked ad:true disappears when its only listing dies.
  offers-auto.js    Offers found automatically. Offers older than 5 days are hidden.
  art.js            Placeholder drawings and icons. A few laptops have their own drawing in
                    LART (name, colours, label). Any other laptop gets a plain grey one. Add
                    a LART entry to give a laptop a drawing. Also holds the footer icons
                    (ICO, including LinkedIn).
  alerts.js         The bell button in the header and its email signup popup, plus the
                    /unsubscribe page. See NEW-LAPTOP EMAILS below.
  app.js            The page logic: routing, lists, laptop pages, Jiji buttons, footer.
                    Edit only to change behaviour.
  blog.js           The blog: a featured card plus smaller cards on the home page, and one page
                    per article at /blog/<post-name>. The articles are written in this file,
                    each with a "reads" number that is used if the live counter is down.
                    It plugs into app.js, so keep blog.js after app.js in index.html.
  functions/        Cloudflare Pages Functions for the reads counter (see BLOG READS).
  images/           Put your real photos here (they cover the placeholders automatically):
    hero.jpg, all.jpg
    students.jpg, programmers.jpg, gamers.jpg, creators.jpg, home-work.jpg
    macbook-deals.jpg, windows-deals.jpg, linux-deals.jpg
  images/laptops/   One photo per laptop, named after it in lowercase with hyphens,
                    e.g. apple-macbook-air-m2.jpg, acer-nitro-v-15.jpg
  images/blog/      The pictures for blog posts.
  schema.sql        The database setup for the reads counter (and the email list).

  Other files in the root:
  favicon.ico, icons/, apple-touch-icon.png   site icons
  og-image.png        1200 x 630, shown when the link is shared on X, WhatsApp, Facebook, LinkedIn
  sitemap.xml         Every page for Google: home, use and deals pages, /blog, each blog post
                      and each laptop. Add a line when you add a laptop or a post, then
                      re-submit it in Google Search Console (Sitemaps).
  robots.txt          Lets Google in and points to the sitemap.
  CNAME               Only GitHub Pages used it. Cloudflare Pages ignores it.
  SETUP-CLOUDFLARE.md How the Cloudflare Pages project and the reads database were set up.

  Optional: jiji-bands.js is written by tools/jiji-range.js and holds Jiji price ranges.
  index.html does not load it right now, so the buttons only show a range when you set one
  by hand in JJ (data.js). To use the automatic ranges, add
  <script src="/jiji-bands.js"></script> after data.js in index.html.

  Note: if you prefer css/ and js/ folders, move the files into them AND change the
  <link> and <script> paths in index.html to match. They must agree or the site breaks.

EDITING data.js (the jobs you will do most)
  data.js has six parts, each with a comment at the top of the file: 1) RATE, CATS, DEALS,
  2) P (the laptops), 3) LINUX and SELL, 3b) OFFERS, 4) VARS, 5) ratings, 6) SOCIALS.

  RATE is cedis per naira (now 0.00888, about N1,380 and GH 12.25 to the dollar, rule of
  thumb N = GH x 113). Re-check it when the dollar moves. It drives the budget filter, the
  Gamers price limit, and the conversion when a laptop has a price in only one currency.

  To add a laptop, add one line to P. The fields:
    n      name. Spell it the same everywhere (OFFERS, VARS and LINUX match on this name)
    c      New, Used or Refurbished
    s      [screen, memory, storage, processor, graphics] for the usual version
    u      categories: Students, Programmers, Gamers, Creators, Home & Work
    pr     the real price in each country's own money, e.g. pr:{GH:8999,NG:1100000}
           (cedis for GH, naira for NG). Type the number you want to see, no converting.
    cn     countries where it is listed, e.g. cn:["GH"]. The laptop shows, and gets Buy
           buttons, only in those countries. Remove cn to show it in both.
    url    exact Jiji listing, e.g. url:{Jiji:"https://jiji.ng/..."}. Without it the button
           opens a Jiji search for the laptop.
    est:1  the price is an estimate. Replace it with the Jiji median, then delete est:1.
    mx     your own top price for the Jiji link, e.g. mx:{GH:8000,NG:900000}
    q      your own Jiji search words, if the laptop name finds the wrong things
    ad:true  this laptop exists only for one listing, so hide it when that listing dies
           (needs url)
    match  words a seller's title must contain for the finder to count it as this laptop
    pro, con   the pros and cons lists
  Apple laptops (name starts with Apple) go to MacBook Deals, all others to Windows Deals.
  To list a laptop under Linux Deals, add its name to the LINUX list.
  After adding a laptop, also add its page to sitemap.xml.

  CAP sets a price limit for a use page, in cedis. Now: Gamers GH 3,500 to 16,000. A laptop
  outside the limit does not show on that page. The GPU rules for Gamers and Creators are
  written in a comment near the bottom of data.js.

  Use pages: the budget list has no "Any budget". Its highest "Under" choice is the priciest
  laptop on that page (rounded up) and is picked when the page opens. Laptops are listed
  cheapest first. The left panel ("Select use") jumps to another use.

  Buying links: Jiji is the only seller now (Jumia was removed, Tonaton is still planned).
  A Jiji button goes to the laptop's own url if it has one and the listing is not dead.
  Otherwise it opens a Jiji search with &price_max set to the price x JIJI_CAP (1.25), so
  sellers asking far too much are filtered out. Hover note on every button: BUYTIP in app.js
  (phones show it as a small line under the buttons).

  OFFERS are the real discounts. One line each: n (laptop name), c (GH or NG), was, now,
  src ("Jiji"), url (exact listing), upd (date you checked it). The site works out the % off.
  Jiji listings have no old price, so use the laptop's usual price as "was". Only add real,
  checked offers. Laptops with offers are shown first in "Best deals right now".

  VARS are the extra configurations on a laptop's page:
  [RAM, storage, processor, graphics, price multiplier, on sale?]. The first row is always
  the usual version. Multipliers are rough estimates.

  Ratings: 1 Low, 2 Average, 3 Solid. Memory and storage are rated by size. Processors and
  graphics come from RCPU and RGPU (anything not listed counts as Average). They are our own
  simple estimate, and the laptop page says so.

  SOCIALS: Email, YouTube, X, Instagram and TikTok are set. An empty url shows "coming soon"
  when tapped. To add LinkedIn (left out for now), add {k:"linkedin",label:"LinkedIn",url:"..."};
  its icon is already in art.js.

THINGS THE SITE SHOWS THAT ARE NOT LIVE DATA
  - The "Good deal" badge and the price-history numbers are NOT tracked prices. app.js
    (hist) makes a made-up 12-step history from each laptop's price, then calls it a good
    deal if today's price is 5% under that made-up average. Real discounts come only from
    OFFERS and offers-auto.js (shown as "% off"). Do not describe "Good deal" as a real
    price drop anywhere.
  - Every laptop page has the same "Checks before buy" list (checksUI in app.js). Its first
    item links to /blog/check-battery-health.
  - The footer says prices are ballpark figures from Jiji and change often.

NEW-LAPTOP EMAILS (the bell button)
  - The bell sits in the header. alerts.js adds it, so index.html needs no change. It opens a
    popup that asks for an email and promises emails when a new laptop is added.
  - Saved emails go to the Supabase table "subscribers" (one column used: email). An email
    already on the list shows "This email is already on the list".
  - A hidden extra field catches bots. A bot that fills it sees a success message and
    nothing is saved.
  - alerts.js holds ONLY the publishable key (safe to be public, row-level security lets
    visitors add a row and nothing else). NEVER put the secret key in any file in the repo,
    because the repo is the website.
  - The emails are sent by scripts/notify-new-listings.mjs when you add a laptop to data.js.
    Every email has an unsubscribe link: /unsubscribe?t=<token>. That page calls the
    unsubscribe() function in Supabase and shows "You are unsubscribed".
  - The browser remembers the signup (gpn_sub, gpn_email) so the bell stays highlighted.
  - If a save fails the popup says "Sorry, that did not save". Press F12 > Console to see
    the reason from Supabase.
  - The Supabase table, row-level security and the unsubscribe function are set up by the
    SQL in schema.sql. Run it in the Supabase SQL editor.

BLOG READS (the live counter)
  - Each article shows how many times it was read. Counts live in a Cloudflare D1 database
    bound to the site as DB.
  - functions/api/views.js        GET /api/views gives all counts, e.g. {"ram-8-vs-16":42}
  - functions/api/views/[slug].js POST /api/views/<slug> adds 1 and returns {"n":43}.
    The slug may only be a-z, 0-9 and hyphens (up to 80 characters), the request must come
    from the site itself, and at most 200 articles are allowed.
  - A read counts once per visitor per article per day, and search bots are ignored.
  - If the database is down, the blog still works and shows the "reads" number written in
    blog.js.
  - Setup (already done, steps are in SETUP-CLOUDFLARE.md): create the D1 database "getpcnow",
    run schema.sql in its Console, and bind it to the Pages project with the variable name
    exactly DB. A binding only applies to deployments made after it.

CHECKS AND SCRIPTS (not part of the website)
  scripts/check-listings.mjs     Checks the Jiji links and writes dead.js.
  scripts/notify-new-listings.mjs  Emails the list when you add a laptop to data.js.
  tools/jiji-range.js            Reads the cheapest matching Jiji listings for each laptop
                                 and writes the price ranges into jiji-bands.js.

EMAIL TEMPLATES (email/ folder, NOT uploaded to the website)
  email/price-drop-email.html   The email visitors will receive. {{double-brace}} words
                                are filled in when it is sent.
  email/preview.html            The same email with sample values. Double-click to view.
  email/send-test-email.js      Sends the sample email to YOUR inbox. Instructions are
                                at the top of the file (uses a free Resend account).

GOOGLE
  Search Console is set up for getpcnow.shop. After you add pages or posts, update
  sitemap.xml, then Sitemaps > submit it again. For a new page you can also use URL
  inspection > request indexing.

TO GO LIVE
  Push the site files, the functions/ folder and images/ to GitHub from VS Code. Cloudflare
  Pages redeploys by itself. Do not upload the email/ folder. Keep secret keys out of every
  file in the repo.
