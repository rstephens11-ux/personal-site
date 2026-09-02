# Ryan Stephens — Personal Site

Hand-coded static website. No frameworks, no build step, no trackers.
Deployed via **GitHub Pages** from the `rstephens11-ux/personal-site` repo.
Domain `ryanmichaelstephens.com` (CNAME file in this repo), DNS at NameSilo.

## Voice & tone (non-negotiable)

Ryan's copy is deliberately self-deprecating and unpolished ("cold af"). That is
the charm. **Never polish, professionalize, or "improve" his wording** unless he
explicitly asks. His voice is the product.

## Design

Typography-first minimal dark with muted, earthed accents — rust / slate / moss /
ochre. **Never neon.** Subtle motion only. Restraint, not costumes.

## File map

| File | What it is |
|---|---|
| `index.html` | Home: hero + coast line, projects index, about split, contact |
| `projects.html` | Wood Projects — expanded with spec tables |
| `other.html` | "Other Jawnz" |
| `about.html` | Bio, the creed, favorite places |
| `now.html` | What Ryan is doing now (hand-updated, has a "Last updated" date) |
| `style.css` | All styling; colors at the top in `:root` |
| `scripts.js` | Marquee loop, scroll reveals, local-time clock |

Nav: **Wood Projects / Other Jawnz / About / Now / Contact**.
Contact email: `hi@ryanmichaelstephens.com`.

## Editing conventions

- Every editable region is marked with a comment starting `✏️ EDIT` — search any
  file for `✏️` to find them.
- To add a project to the home page, copy one whole `<a class="work …">…</a>`
  block and change the words. The `w-coral` / `w-sky` / `w-lime` / `w-gold`
  class picks the color.
- To add a project page entry, copy one whole `<article class="project …">`
  block in `projects.html`, change words + `id` (any short word, no spaces).

## Workflow with Ryan

- Ryan edits files himself in VS Code, then asks me to **commit + push + verify**
  ("I made updates, add them to the site"). He handles wording/saving; I handle
  git + structure checks + live confirmation.
- **His #1 gotcha: he forgets to save (⌘S) in VS Code, then asks why the site
  didn't update.** Check the file on disk first — before assuming a bug or a
  broken deploy.
- Deploy = push to `main`; GitHub Pages serves it. After pushing, verify live at
  https://ryanmichaelstephens.com — don't claim "live" until the page actually
  reflects the change.
