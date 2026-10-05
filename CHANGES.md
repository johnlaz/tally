# Tally ARS 1.1.0 — changelog

Unzip over the repo root, then delete the files listed under "Delete".

## Delete from the repo
- `manifest.json`, `sw.js`, `favicon.ico` (root)
- `icons/` (whole folder)
- `app/.keep`, `app/assets/` (sample-decks.json moved to `app/`)

## Changed / added
| File | What changed | Why |
|---|---|---|
| `index.html` (root) | Replaced the duplicate app copy with a real landing page: live tally-mark demo, join-by-code form, screenshots, footer with © and email | Root had no landing page; duplicate app drifted from `/app` |
| `app/index.html` | Icon links now `icon-192.png`; `maximum-scale` removed; `<h1>` + tagline + version stamp on home; focus-visible styles; higher contrast on Join/Display buttons; sample-decks path; slide rows titled in dashboard list; Groq keep-and-flag (no auto-swap, narrower retired-model detection); update toast; single `APP_VERSION` | Audit items 1, 3, 4, 5, 9 |
| `app/manifest.json` | Relative start, no hardcoded `id`, icons 192/512 maskable-safe, narrow + wide screenshots | Items 1, 2 |
| `app/sw.js` | Cache `tally-app-v1.1.0`, 4 s network timeout then cache, update waits for Reload, precache list verified | Item 3 |
| `app/icon-192.png`, `app/icon-512.png` | Rebuilt with safe-zone padding; replace the 15 files in `icons/` | Flatten |
| `app/sample-decks.json` | Moved from `app/assets/`, unchanged | Flatten |
| `app/shot-phone-1.png`, `shot-phone-2.png` (780x1688), `shot-wide.png` (1280x720) | Simulated captures of the real app (stand-in Firebase, sample deck) | Manifest screenshots |
| `README.md` | Rewritten: live URLs, layout, AI/model, data & privacy, Firebase rules, deploy, changelog | Item 7 |
| `docs/flow.svg`, `docs/architecture.svg` | New README diagrams, checked on light and dark | Item 7 |

## Not done
- Script integrity (SRI) hashes: could not fetch the CDN files to hash them.
- Firebase rules: starter ruleset in README is untested; real protection needs Anonymous Auth.

## Reinstall
Existing installs may need one reinstall: the old root manifest is gone and the app install id changed.
