# Ryan Stephens — Personal Site

Static HTML/CSS/JS, published by GitHub Pages from `main` at https://ryanmichaelstephens.com.
No site framework, trackers, or generated-media API calls. A local Python build turns Markdown posts into static HTML.

## Current PS1 design

- `index.html`: coastal road and clickable Tacoma → `home.html`.
- `home.html`: house scene; garage → Wood, front door → About, windows → Other Jawnz, mailbox → email, garden bed → Gardening, notice → Now.
- `projects.html`: woodworking posts/photos; workshop background.
- `other.html`: other projects; upstairs AI lab background.
- `gardening.html`: garden background and notes.
- `about.html`: operator file inside a monitor; scroll inside the screen.
- `now.html`: wood-and-parchment noticeboard.
- `style.css` / `scripts.js`: shared base styling and small interactions.
- Page-specific styles: `wood-projects.css`, `other-jawnz.css`, `about-monitor.css`, `now-noticeboard.css` (Gardening and home have inline overrides).
- `post-content.css` / `post-controls.js`: project filters, sorting, imported post layout.
- `photos/`: actual project photos. Root PNG/WebP assets provide scene artwork.

The lab is an imagined interior. Its single window is on an adjacent wall rather than the exterior's same-wall arrangement; that known visual mismatch was disclosed during review.

## Editing

The authoritative editing/publishing folder is `~/personal-site/`. `~/personal-site-mock-terminal/` is the original mock, not a second publishing source.

1. Edit a page in VS Code and **save (⌘S)**.
2. Open the HTML in a browser (or run a local static server) and test.
3. Review `git diff`, stage intended files, commit, and push to `main`.
4. Wait for the Pages build and verify the actual public URL.

## Writing posts — no HTML needed

Post text now lives in **`_posts/`**, one `.md` (Markdown/plain-text) file per post:
- `_posts/wood/` → Wood
- `_posts/jawnz/` → Jawnz
- `_posts/gardening/` → Gardening
- `_posts/links/` → Interesting websites, books, and Twitter posts

### Everyday editing
1. Open a post `.md` in VS Code. Write below the second `---` line. Blank lines separate paragraphs.
2. Save with **⌘S**.
3. Double-click **`Update Preview.command`** in the site folder. It rebuilds all four collection pages locally and opens Gardening; use the navigation to check Wood/Jawnz/Links. It does **not** publish. A brief Terminal window is normal.
4. When ready, ask Hermes to publish. Only saved, rebuilt content is published.

If the rebuild fails, an error file opens explaining why. No page is written until every post validates. A missing photo, duplicate ID, or broken details section stops the build rather than silently dropping content.

**Do not edit post text in `projects.html`, `other.html`, `gardening.html`, or `links.html` anymore.** Those post blocks are generated. Navigation, page introductions, About, Now, and Gardening's older standalone tomato note are still edited in HTML. Close your old HTML editor tabs before switching to the `.md` files. The builder detects direct edits inside generated blocks and refuses to erase them.

### Plain-text formatting

```markdown
Your first paragraph. Keep writing however you like.

Another paragraph with **bold words** or *italic words*.

- A list item
- Another item

[Website name](https://example.com)

![Describe the photo](photos/my-photo.jpg)
```

Drop photos in `photos/`, then use their exact filename. Consecutive photo lines form a gallery; the photo viewer works automatically. The photo path is relative to the site folder, not the post file. No HTML or uncommenting needed. Do not reference a photo until the file exists.

### Details at the top

```yaml
---
title: "building chicken coop"
id: post-chicken-coop
category: building
tag: Building
date: ''
order: 2
accent: lime
specs:
  Date: Date to come
---
```

- `title`: what visitors see. Quote a title containing a colon, for example `"Notes: the garden"`.
- `id`: the permanent link. **Keep existing IDs unchanged**, even if you rename a title.
- `category`: must match one of the page's filter buttons.
- `tag`: the short label beside the title.
- `date`: sort date, `YYYY-MM`, `YYYY-MM-DD`, `ongoing`, or `''` if unknown. It does not invent or update the displayed date.
- `order`: default display order, lower numbers first.
- `accent`: `lime`, `coral`, `gold`, or `sky`.
- `specs`: displayed details. Keep each detail indented two spaces. Change `Date to come` to the actual date when known.
- Some migrated posts have `heading_id` or side-by-side image settings. Leave those as-is unless changing that layout.

Gardening categories: `building`, `chickens`, `kitchen`, `growing`.
Wood categories: `joinery`, `carving`, `steam-bending`, `chairmaking`, `greenwoodworking`, `general`.
Jawnz categories: `software`, `animated-series`, `seasonal`.

### Add an interesting website, book, or Twitter post

The **Links** page opens on Websites, with Everything / Books / Twitter posts filters. It starts empty; test examples are not published recommendations.

1. Copy `_authoring/new-website.md.example` into `_posts/links/` and rename it to something like `my-favourite-site.md` (remove `.example`). Book and Twitter templates sit beside it.
2. Fill in `title`, a unique permanent `id`, and `url`. Use `category: websites`, `books`, or `twitter`.
3. Write any notes below the second `---`, save, then double-click Update Preview.command. Open Links from the site navigation.

```markdown
---
title: "Website name"
id: website-name
category: websites
url: "https://example.com"
order: 1
accent: sky
---

What I found interesting about it.
```

Books can omit `url` or leave it empty. To show an author, add `specs:` with an indented `Author: Name`. Twitter posts take the full link to the post, not an embed code. No Twitter scripts, external previews, or tracking widgets are loaded. Destination links open normally in the current tab; Copy link shares your entry on this site, not the external destination.

### Add a new post

Duplicate an existing `.md` in the matching folder, or copy `_authoring/new-post.md.example` and rename its ending to `.md`. Set a **new unique `id`**, title, category, order, and your text. If duplicating a file with `heading_id`, remove that line or make it unique too. Rebuild and preview. Remove a post by moving its file outside `_posts/` and rebuilding.

All `.md` files in these folders are published posts, **not private drafts**. Keep drafts outside the public repository. The repository itself is public even though the authoring folders are excluded from the hosted website.

### Publishing / developer checks

The generated HTML is committed alongside the Markdown. GitHub Pages still serves static files; no live server or database was added.

```bash
.venv/bin/python _authoring/test_build.py
.venv/bin/python _authoring/build.py
.venv/bin/python _authoring/build.py --check
```

Review the diff and stage intended Markdown, generated HTML, and any new photos together before committing/pushing. On a fresh checkout, install `_authoring/requirements.txt` into `.venv` and run `--check` once to establish the overwrite-protection baseline before editing. `_config.yml` excludes authoring tools and content sources from Pages output.

Contact links use `mailto:hi@ryanmichaelstephens.com`; they open the visitor's email app and do not send automatically. Clicking the name in content-page navigation returns to the house.

## Classic design backup / future theme switch

Classic snapshot: **`classic-pre-ps1-2026-09-05`**, commit `ffc7dd7057826f44463b92d1995cd53e29d748b3`.
It is an annotated Git tag pushed to GitHub. The complete classic source and media remain accessible there.

Local verified copies are under:
`~/personal-site-backups/classic-pre-ps1-2026-09-05/`
- `classic-site.zip`: complete classic working files.
- `classic-history.bundle`: offline Git history/refs.
- `manifest.json`: hashes and source commit.

A future integrated Classic / PS1 switch is deferred; use one shared content source when implementing it. There is no theme toggle yet.

### Rollback

For an immediate rollback right after this launch: review the launch commit, then `git revert <PS1-launch-commit>` and push the resulting commit. This restores the classic files and removes newly introduced launch files without rewriting history. See the external launch record for the exact commit.

If later commits exist, do not blindly revert: first preserve current work, inspect changes since the classic tag, and restore in a separate reviewed commit. Restoring the classic tag also restores its historical content, not later posts.

The existing `CNAME` and DNS configuration stay in place; no Netlify setup is used.
