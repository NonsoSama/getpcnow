# Setup: real URLs + live "reads" counter

The site now uses real addresses (`/blog/ram-8-vs-16`, `/all`, `/laptop/...`) instead of `/#/...`.
GitHub Pages cannot serve those addresses properly (it answers "404" for any page that is not a real file),
so Google would skip them. Cloudflare Pages can, it is free, and your domain is already on Cloudflare.
It reads the same GitHub repo, so you keep pushing from VS Code as before.

Do the steps in this order so the site never breaks.

## 1. Create the Cloudflare Pages project
1. Cloudflare dashboard -> **Workers & Pages** -> **Create** -> **Pages** -> **Connect to Git**.
2. Pick your `getpcnow` repo.
3. Framework preset: **None**. Build command: leave empty. Build output directory: leave empty (or `/`).
4. **Save and Deploy.** (It deploys your current site as it is right now.)

Important: never add a file called `404.html` to the repo. Without it, Cloudflare Pages serves your
app for every address, which is what makes `/blog/...` work.

## 2. Move getpcnow.shop to it
1. In the new Pages project -> **Custom domains** -> **Set up a custom domain** -> `getpcnow.shop`.
2. Cloudflare will offer to replace the old DNS record that points to GitHub. Accept.
3. Wait until the domain shows **Active** and open https://getpcnow.shop to check the site loads.
4. Optional tidy-up: GitHub repo -> Settings -> Pages -> remove the custom domain.

## 3. Create the reads database (D1)
1. Dashboard -> **Storage & Databases** -> **D1** -> **Create database** -> name it `getpcnow`.
2. Open it -> **Console** -> paste the contents of `schema.sql` -> **Execute**.

## 4. Connect the database to the site
1. Pages project -> **Settings** -> **Bindings** (called "Functions" in some versions) -> **Add** -> **D1 database**.
2. Variable name must be exactly `DB`. Database: `getpcnow`. Save for **Production**.

## 5. Push the new files
Copy these into the repo root (keep the `functions` folder structure), then commit and push from VS Code:

    index.html  app.js  blog.js  blog.css  sitemap.xml  robots.txt  schema.sql
    functions/api/views.js
    functions/api/views/[slug].js

Cloudflare redeploys by itself in about a minute (the database link in step 4 only applies to deployments made after it).

## 6. Check it
- Open https://getpcnow.shop/blog/ram-8-vs-16, then refresh the page. It must stay on that article.
- Open https://getpcnow.shop/api/views. It should show something like `{"ram-8-vs-16":1}` after you have opened an article.
- Old links like `getpcnow.shop/#/post/ram-8-vs-16` jump to the new address automatically.

## 7. Tell Google
Search Console -> **Sitemaps**: remove the old one and submit `sitemap.xml` again.
Then URL inspection -> request indexing for `https://getpcnow.shop/` and `https://getpcnow.shop/blog`.

## Notes
- Reads count once per visitor per article per day, and search bots are ignored. Counts start from 0.
- The free D1 plan allows 100,000 writes a day, far more than this site will use.
- If the database is down, the blog still works and shows the `reads` number written in `blog.js`.
- The pages use paths that start with `/`, so opening index.html by double-clicking it will not work.
  Use VS Code Live Server, or just push and test on the real site.
