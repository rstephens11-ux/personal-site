# Ryan Stephens — Personal Site

Hand-coded static HTML/CSS/JS, no framework or build step. GitHub Pages deploys `main` from `rstephens11-ux/personal-site` at `ryanmichaelstephens.com`; CNAME and NameSilo DNS already configured.

## Voice
Ryan's spelling, jokes, and self-deprecating copy are intentional. Never polish or professionalize unless explicitly asked. Check on-disk saves before debugging deployment; stale VS Code buffers can undo external edits.

## Design / scope
Current design is the approved PS1/retro mock: coastal Tacoma intro, house navigation, workshop/garden/lab backdrops, About monitor, Now wood noticeboard. The old minimal classic design is preserved at Git tag `classic-pre-ps1-2026-09-05`; do not reapply its old "never neon" rule to this design.

Make one requested change at a time. Moving an object preserves its size and all unrelated properties. No paid generation without approved scope/cost. Keep background source originals outside publication; do not publish generation scripts, .checks/, raw prompts, credentials or local backup folders.

## Files
- index.html: coastal road/Tacoma portal → home.html (no scroll).
- home.html: house SVG hotspots, truck pull-in (no scroll). Source-coordinate overlay tracks CSS cover crop; short landscape screens use an adjusted vertical crop. Normal portrait calibration is preserved.
- projects.html / other.html: article.record posts, data-date/category + post-controls.js filters.
- gardening.html: PS1 garden background and notes; no floating bed illustration.
- about.html + about-monitor.css: existing biography inside an internally scrolling CRT frame.
- now.html + now-noticeboard.css: four parchment status notes, dated header.
- style.css/scripts.js shared; page-local styles take precedence.
- photos/: original project photos. See README.md for full inventory.

Navigation names: WOOD / JAWNZ / GARDENING / ABOUT / NOW / CONTACT.
Contact uses mailto:hi@ryanmichaelstephens.com (old index.html#contact no longer exists).

## Workflow
`~/personal-site/` is authoritative after launch. `~/personal-site-mock-terminal/` is the retained mock/QA workspace, not auto-synced.
Before publishing: inspect git status/diff, test local links/fragments/media, phone and desktop layouts, home hotspots, About internal scrolling, post filters. No credentials or unrelated files in commits. Push only intended files and read back the actual live pages; a push alone is not verification.

Classic archive/history backup: `~/personal-site-backups/classic-pre-ps1-2026-09-05/`.
Future integrated theme switch remains queued; content should eventually be shared once, not manually duplicated forever.
