# Vancouver Flooring — website

A one-page site for Slava & Alexander. It's plain HTML/CSS/JS with no build
step. The files live on **GitHub**, it's hosted for free on **Cloudflare
Pages** at https://vancouver-flooring.pages.dev/, and the owners edit it
through **Pages CMS**, a free admin page.

```
index.html  styles.css  app.js     the page
data/gallery.json                  gallery items (edited in the admin)
data/site.json                     phone, email, hours, areas (edited in the admin)
media/                             uploaded photos and videos
.pages.yml                         admin configuration
```

## 1. Put it online (one time, ~15 minutes)

1. Create a free account at https://github.com (use the business email).
2. Create a new **public** repository, e.g. `vancouver-flooring`.
3. Upload every file in this folder. Make sure the hidden ones (`.pages.yml`,
   `.nojekyll`) go too. The easiest way is to drag the folder into the
   repo's "Add file → Upload files" page, or use GitHub Desktop.
4. At https://dash.cloudflare.com go to **Workers & Pages → Create →
   Pages → Import an existing Git repository**, connect GitHub and pick the
   repo. Leave the framework preset as *None* and the build command and
   output directory empty, then click **Save and Deploy**.
5. About a minute later the site is live at
   `https://<project-name>.pages.dev/`. Every commit to `main`, including
   saves from the admin, redeploys it automatically.

The old GitHub Pages address (`vancouver-flooring.github.io/vancouver-flooring/`)
stays switched on only to redirect visitors to the new address.

Optional: a custom domain such as `vancouverflooring.ca` (~$15/yr) can be
added in Cloudflare under the project's **Custom domains** tab. Hosting
stays free. If you add one, replace `vancouver-flooring.pages.dev` in
`index.html`, `robots.txt` and `sitemap.xml`.


## 3. Adding a new job (owners)

1. Open https://app.pagescms.org on a phone or computer and pick the site.
2. Click **Gallery (our work)** → **Add an entry**.
3. Upload a **photo or video**, then fill in the title, flooring type, area,
   date and a short description.
4. Click **Save**. The site updates within about a minute.

To change the phone number, email or hours, open **Contact info & text**.

Tips
- Tick **Use as the big photo at the top** on your best shot.
- Tick **Hide from the site** to take an item down without deleting it.
- Keep each video under 25 MB (about 20–30 seconds of phone video).
  Cloudflare won't serve bigger files. Put longer videos on YouTube.
  Photos straight off a phone are fine.
- The newest job (by date) shows first.

## Preview on your own computer

Opening `index.html` directly won't load the gallery, because browsers block
reading local JSON files. Run a tiny local server from this folder instead:

```
python -m http.server 8000
```

Then open http://localhost:8000.
