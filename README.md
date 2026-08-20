# Ryan Stephens — Personal Site

Hand-coded static website. No frameworks, no build step, no trackers.
Open `index.html` in a browser and it just works.

## File inventory

| File | What it is |
|---|---|
| `index.html` | Home: hero + coast line, projects index, about split, contact |
| `projects.html` | All projects, expanded with spec tables |
| `about.html` | Bio, the creed, favorite places |
| `now.html` | What Ryan is doing now (update by hand, anytime) |
| `style.css` | All styling for every page (colors at the top in `:root`) |
| `scripts.js` | Marquee loop, scroll reveals, local-time clock |

## How to edit things (no HTML experience needed)

Every editable region is marked with a comment that starts with `✏️ EDIT`.
Search any file for `✏️` to find them. General rules:

- **Add a project to the home page** — in `index.html`, find the `✏️ EDIT` comment
  above the projects list. Copy one whole `<a class="work ...">…</a>` block, paste it,
  change the words. The class `w-coral` / `w-sky` / `w-lime` / `w-gold` picks its color.
- **Add a full project page entry** — same idea in `projects.html`: copy one whole
  `<article class="project …">…</article>` block, paste it at the end, change the words
  and the `id="..."` (any short word, no spaces).
- **Update the /now page** — in `now.html`, edit any `<div class="now …">` block, and
  change the date in the "Last updated" line near the top.
- **Change colors** — in `style.css`, the very top (`:root{ … }`). Change one hex
  code and the whole site follows.
- **Set the email address** — in `index.html`, search for `yourdomain.com` and replace
  it in both places (the `mailto:` link and the visible text).

## How to put it on the internet (NameSilo + Netlify, free)

Two things happen: (1) the files go to a free host, (2) your domain points at them.

### Step 1 — Host the files (about 3 minutes)

1. Go to **https://app.netlify.com/drop** in a browser.
2. Make a free Netlify account if asked (email sign-up is fine).
3. Drag this whole `personal-site` folder onto the page.
4. Netlify gives you a random address like `sparkling-otter-123.netlify.app`.
   Click it — your site is live on the internet already.
5. In Netlify: **Site configuration → Change site name** → pick something like
   `ryanstephens` so the address becomes `ryanstephens.netlify.app`.

### Step 2 — Point your NameSilo domain at it

1. Still in Netlify: **Domain management → Add a domain** → type your domain
   (e.g. `yourdomain.com`). Netlify will show you the DNS values it wants.
   It usually wants:
   - an **A record**: host `@` → `75.2.60.5`
   - a **CNAME record**: host `www` → `ryanstephens.netlify.app` (your site name)
2. In a new tab, go to **namesilo.com** → log in → **Manage My Domains** →
   click your domain → find **DNS Records / Manage DNS**.
3. Delete (or ignore) NameSilo's default "parking" records.
4. Add the two records from step 1 exactly as Netlify shows them
   (A record with host `@`, CNAME with host `www`, TTL 3600).
5. Wait. DNS takes 5 minutes to a few hours to spread around the internet.
6. Back in Netlify: once it detects the domain, turn on **HTTPS** (one click,
   free certificate, automatic). Your site is now `https://yourdomain.com`.

### If you get stuck

- Domain not resolving after 24 h → check the DNS records were saved in NameSilo,
  and that there aren't two conflicting A records.
- "Not secure" warning → HTTPS wasn't enabled in Netlify yet (step 6).
- Want me to do it with you → open this folder in Hermes and ask.

## Editing tips

- Keep backups: before a big edit, duplicate the file (e.g. `work-backup.html`).
- Preview by double-clicking the HTML file — it opens in your browser.
- Nothing here can "break the internet" — worst case, you re-upload the folder
  to Netlify (drag it onto your site's Deploys page) and it's fixed in seconds.
