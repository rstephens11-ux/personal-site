# Ryan Stephens — Personal Site

Static HTML/CSS/JS, published by GitHub Pages from `main` at https://ryanmichaelstephens.com.
No framework, build step, trackers, or generated-media API calls in the site.

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

To add a post, copy an `<article class="record …">` block in the matching page. Set its unique `id`, `data-date` (`YYYY-MM` or `ongoing`) and `data-category` for filtering. Keep the category consistent with a filter button. Post photos remain ordinary photos, not PS1 conversions.

For Now, edit `.nowline` notes and the actual last-updated date. Gardening retains a dated copy of the Growing note; it is not automatically synchronized. Preserve Ryan's deliberately unpolished wording.

### Editing the Gardening posts

Open `gardening.html` and search for `EDIT POST` to find the six post blocks. They use the same article/body/photo structure as Wood:
- Replace `<p>Notes to come.</p>` with your writing. Add more `<p>...</p>` paragraphs as needed.
- Replace `Date to come` with the real date; none has been assumed.
- Each post contains a commented-out photo block. Add your photo to `photos/`, update the `src` filename and `alt` description, then remove the surrounding `<!-- ... -->` markers for that photo block.
- Categories are `building`, `chickens`, `kitchen`, and `growing`. Set `data-category` to match the desired filter.
- To add another post, copy a complete `<article>...</article>` inside `.garden-posts`, give the article and heading unique IDs, and update `aria-labelledby` to match the heading ID.

Gardening currently filters by category only; it does not sort by date. These are HTML edits, not an in-browser editor. Save with ⌘S, preview, then publish. If the file was open while Hermes changed it, close and reopen the tab before editing so an old editor buffer does not overwrite the new structure.

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
