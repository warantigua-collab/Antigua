# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page, static "treasure map" site for San Cristóbal El Alto (Antigua, Guatemala): a hand-illustrated SVG map with pins for viewpoints, restaurants, lodging, wellness spots, and landmarks, plus a localStorage-backed "passport" stamping feature. English/Spanish toggle. No backend, no accounts.

## Running / developing

No build step, no package manager, no dependencies.

- Open `index.html` directly in a browser to work on layout, styling, or map/pin logic.
- **Photo galleries require the site to be served from GitHub Pages** (or any host that can reach `api.github.com`) — they fetch `images/<place-id>/` folder contents live via the GitHub API and serve the actual bytes through jsDelivr's CDN. Opening `index.html` from disk will show "photo pending" placeholders instead, which is expected, not a bug.
- There is no lint/test/build tooling in this repo — verify changes by opening the page in a browser.

## Architecture

Three files, no modules: `index.html` (markup only) → `style.css` (all styling) → `script.js` (all logic, wrapped in a single IIFE).

### Data model lives inline in script.js, not in separate data files

- `STRINGS` — every UI string in `en`/`es`, keyed the same in both; `t(key)` reads from whichever is active.
- `CATS` — the 8 place categories (viewpoint, restaurant, cafe, lodging, landmark, nature, wellness, service), each with a bilingual label, a pin color, and an emoji glyph. A category is only shown in the legend/filter chips if at least one place uses it (see `renderLegend`/`renderFilterChips`).
- `PLACES` — the actual map data: one object per pin with `id` (must match its `images/<id>/` folder name), `name`, `cats` (array — a place can belong to multiple categories; **the first entry in `cats` sets the pin's color**), `x`/`y` (percentage position over a 1000×620 canvas), `desc` (`{en, es}`), and `reviews`.

To add or move a place, edit `PLACES` directly — there's no admin UI or separate config file.

### Map rendering is hand-drawn SVG, not a tile/GPS map

`buildTerrainSVG()` and its helpers (`roadPath`, `contourGroup`, `forestPatches`, `treeCluster`, `compassRose`) generate the background terrain and road network as literal coordinate paths, traced by hand from reference screenshots to match the real road shape — this is *not* geographically accurate and isn't meant to be. Pins are separately positioned by the `x`/`y` percentages in `PLACES` and rendered as absolutely-positioned buttons in `renderPins()`, not as part of the SVG itself.

### Render functions are called imperatively, not reactively

There's no framework/virtual DOM — state changes (search, filter, language, stamping) are followed by explicit calls to the relevant `render*()` functions (`renderPins`, `renderPlaceList`, `renderLegend`, `renderFilterChips`, `renderPassport`). When adding new state that affects the UI, follow the existing pattern: mutate the module-level variable, then call every `render*()` function whose output depends on it. `setLang()` is the most complete example of this — it re-renders nearly everything and reopens the modal if one was open.

### Photo loading: GitHub API for listing, jsDelivr for bytes

`fetchPlacePhotos()` asks the GitHub Contents API what files exist in `images/<place-id>/` (any filename works, sorted naturally, capped at `MAX_PHOTOS_PER_PLACE`), then builds jsDelivr CDN URLs (`jsdelivrUrl()`) rather than using GitHub's raw file server, for CDN caching. Results are cached in-memory per `placeId` (`photoCache`). `prefetchPlacePhotos()` fires on pin/list-row hover or focus so photos are often already downloading by the time a visitor opens the modal — an earlier version tried a resize proxy for thumbnails and removed it because the extra round trip cost more than it saved. `.HEIC`/`.HEIF` files are deliberately excluded (`VALID_PHOTO_EXT`) since most browsers can't render them.

If the repo is forked or renamed, `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` near the top of `script.js` need to be updated to match.

### Passport / stamping

`stamped` is a plain object (`placeId -> true`) persisted to `localStorage` under `STORAGE_KEY` (currently `"sancristobal_passport_v3"` — bump this key if the stamp data shape ever changes incompatibly, since old and new shapes would otherwise collide). All reads/writes go through `loadStamped()`/`saveStamped()`, which fail silently if `localStorage` is unavailable (private browsing, etc.).

### i18n

Language is a single module-level `LANG` var, not routed via URL. `setLang()` re-renders all translatable UI in place. When adding new UI text, add the key to **both** `STRINGS.en` and `STRINGS.es`, and if it's static markup in `index.html`, wire it up in `applyStaticStrings()`.

## Adding photos (see `images/README.md` for the full version)

Drop image files into `images/<place-id>/` with any filename — no renaming, no code changes. Only `.jpg`/`.jpeg`/`.png`/`.webp`/`.gif` are picked up; convert HEIC first.
