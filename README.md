# Vancouver Flooring — website

A one-page site for Slava & Alexander. It's plain HTML/CSS/JS with no build
step. It's hosted for free on **GitHub Pages**, and the owners edit it through
**Pages CMS**, a free admin page.

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
4. In the repo go to **Settings → Pages**. Under "Build and deployment",
   choose *Deploy from a branch*, pick `main` and `/ (root)`, then Save.
5. About a minute later the site is live at
   `https://<username>.github.io/vancouver-flooring/`.

Optional: a custom domain such as `vancouverflooring.ca` (~$15/yr from any
registrar) can be pointed at it under Settings → Pages → Custom domain.
Hosting stays free.

## 2. Give Slava and Alexander the admin

1. Each owner creates their own free GitHub account.
2. In the repo go to **Settings → Collaborators → Add people** and invite
   both of them.
3. Each owner opens https://app.pagescms.org, clicks **Sign in with GitHub**,
   approves access, and picks the `vancouver-flooring` repository.

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
- Keep each video under about 90 MB (a 1–2 minute phone clip). GitHub
  refuses files over 100 MB. Photos straight off a phone are fine.
- The newest job (by date) shows first.

## Preview on your own computer

Opening `index.html` directly won't load the gallery, because browsers block
reading local JSON files. Run a tiny local server from this folder instead:

```
python -m http.server 8000
```

Then open http://localhost:8000.
