# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A single-page, static "treasure map" site for San Cristóbal El Alto (Antigua, Guatemala): a hand-illustrated SVG map with pins for viewpoints, restaurants, lodging, wellness spots, and landmarks, plus a localStorage-backed "passport" stamping feature. English/Spanish toggle. No backend, no accounts.

## Running / developing

No build step, no package manager. One external dependency: Leaflet 1.9.4, loaded via `<link>`/`<script>` tags from unpkg in `index.html` with Subresource Integrity hashes (same CDN-link pattern already used for Google Fonts) — nothing to install.

- Open `index.html` directly in a browser to work on layout, styling, map/pin logic, or Events content.
- **Photo galleries require the site to be served from GitHub Pages** (or any host that can reach `api.github.com`) — they fetch `images/<place-id>/` folder contents live via the GitHub API and serve the actual bytes through jsDelivr's CDN. Opening `index.html` from disk will show "photo pending" placeholders instead, which is expected, not a bug.
- There is no lint/test/build tooling in this repo — verify changes by opening the page in a browser.

## Architecture

Three files, no modules: `index.html` (markup only) → `style.css` (all styling) → `script.js` (all logic, wrapped in a single IIFE).

### Data model lives inline in script.js, not in separate data files

- `STRINGS` — every UI string in `en`/`es`, keyed the same in both; `t(key)` reads from whichever is active.
- `CATS` — the 8 place categories (viewpoint, restaurant, cafe, lodging, landmark, nature, wellness, service), each with a bilingual label, a pin color, and an emoji glyph. A category is only shown in the legend/filter chips if at least one place uses it (see `renderLegend`/`renderFilterChips`).
- `PLACES` — the actual map data: one object per pin with `id` (must match its `images/<id>/` folder name), `name`, `cats` (array — a place can belong to multiple categories; **the first entry in `cats` sets the pin's color**), `x`/`y` (percentage position over a 1000×620 canvas), `desc` (`{en, es}`), and `reviews`.

To add or move a place, edit `PLACES` directly — there's no admin UI or separate config file.

### Map rendering is hand-drawn SVG inside Leaflet, not street tiles

`buildTerrainSVG()` and its helpers (`roadPath`, `contourGroup`, `forestPatches`, `treeCluster`, `compassRose`) generate the background terrain and road network as literal coordinate paths on a 1000×620 canvas, traced by hand from reference screenshots (and later a Google Maps screenshot of the real route) to match the real road shape — this is *not* geographically accurate and isn't meant to be, and there's no street data or geocoding anywhere in the site.

That SVG is handed to Leaflet as a custom image layer instead of a tile layer: `initLeafletMap()` base64-encodes `buildTerrainSVG()`'s output into a data URI and adds it via `L.imageOverlay` under `L.CRS.Simple` (a non-geographic coordinate system for exactly this "my own image, not the Earth" use case). Leaflet owns all pan/zoom/pinch gesture handling natively — there is no hand-rolled pointer/touch code in this file, deliberately: an earlier hand-rolled implementation had real reliability gaps (Pointer Events' known multi-touch gaps on iOS Safari, buttons nested inside the drag area needing exclusion from the drag handler, a `will-change:transform` performance fix that blurred the map at high zoom) that Leaflet's mature, widely-deployed engine sidesteps for free.

Two non-obvious things about the Leaflet setup, both in `initLeafletMap()`:

- **The y-axis is flipped.** `CRS.Simple` latitude increases *upward*, but the SVG's y-coordinate increases *downward* like any image. `placeLatLng()` converts a place's `x`/`y` % into a Leaflet latlng via `[MAP_H - py, px]` — dropping the `MAP_H -` inversion silently mirrors every pin vertically.
- **`minZoom`/`maxZoom` are computed per container size, not hardcoded.** `CRS.Simple` zoom 0 means "1 map unit = 1 pixel," which is already too zoomed-in to fit the whole 1000×620 image inside a short mobile map-frame. `applyFitZoomRange()` temporarily sets `minZoom` and `maxZoom` to a wide-open range, calls `getBoundsZoom()` to find the zoom that actually fits the *current* container, then sets the real `minZoom`/`maxZoom` (`+2.5`) from that — recomputed on every resize via a `ResizeObserver` on `mapContainer`, and also whenever the desktop view toggle (below) reveals a previously-hidden map. `getBoundsZoom()` clamps its own answer to the map's *current* min **and max** zoom, so both temporary bounds have to be loosened first — a stale value on either side (e.g. left over from a computation made while the container was `display:none` and measured as 0x0) silently caps the new computation too.
- **Zoom animation is off** (`zoomAnimation`/`markerZoomAnimation`/`fadeAnimation: false`). Leaflet's animated zoom depends on a `transitionend` CSS callback that didn't reliably fire in testing; zoom is instant instead of animated as a reliability tradeoff.

Pins are Leaflet markers (`L.marker` + `L.divIcon`, built in `pinIcon()`), not part of the SVG or absolutely-positioned buttons — `renderPins()` creates one marker per place on first render and calls `marker.setIcon()` on subsequent renders (search/filter/language/stamping) rather than recreating markers. Markers stay a constant on-screen size regardless of zoom level, which is Leaflet's native marker behavior, not something this code manages.

### Desktop shows one panel at a time (Places or Map); mobile always stacks both

Above the `min-width: 901px` breakpoint, `#mainGrid` carries a `view-places`/`view-map` class (toggled by `activateMainView()`, wired to the `#mainViewToggle` tabs) that shows one of `.sidebar`/`.map-frame` at a time via `display:none` on the other, defaulting to Places. Below that breakpoint the toggle is hidden entirely and both panels stay stacked (list first) exactly as before this feature existed — the `view-*` classes are still present on mobile but have no effect there, since the CSS that acts on them is scoped to the desktop media query.

This means `.map-frame` (and `#mapContainer` inside it) is `display:none` at the moment `initLeafletMap()` runs on page load, since Places is the default view. Leaflet measures a hidden container as 0x0, so the `minZoom`/`maxZoom`/`fitBounds()` computed at init are garbage — `activateMainView()` accounts for this by calling `leafletMap.invalidateSize()` followed by `leafletMap._applyFitZoomRange()` (the same function from `initLeafletMap()`, stashed on the instance for exactly this reason) and `leafletMap.fitBounds(mapBounds)` every time it switches *to* the map view, not just the first time — simpler and more robust than tracking whether this is the map's first-ever reveal, at the minor cost of the map re-fitting (losing manual pan/zoom) each time you tab away and back.

### Render functions are called imperatively, not reactively

There's no framework/virtual DOM — state changes (search, filter, language, stamping) are followed by explicit calls to the relevant `render*()` functions (`renderPins`, `renderPlaceList`, `renderLegend`, `renderFilterChips`, `renderPassport`). When adding new state that affects the UI, follow the existing pattern: mutate the module-level variable, then call every `render*()` function whose output depends on it. `setLang()` is the most complete example of this — it re-renders nearly everything and reopens the modal if one was open.

### Photo loading: a static `default.*` fast path, GitHub API for the full listing

GitHub's unauthenticated Contents API caps out at 60 requests/hour per visitor IP — trivial to blow through if every place's folder gets listed on every page load (an earlier version of the place list did exactly that, eagerly, for all 12 places, and would silently stop finding *any* photos, list thumbnails or modal galleries alike, once the budget ran out).

Two independent paths now share the same `images/<place-id>/` folder:

- **List thumbnail (`renderPlaceList`) and the modal's instant preview (`openModal`)** never call the GitHub API. `defaultThumbCandidates(placeId)` builds jsDelivr URLs by naming convention alone — `images/<place-id>/default.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` — and `loadFirstWorkingImage()` tries each via an `<img>`'s `onerror` fallthrough until one exists (or falls back to the category-glyph swatch if none do). No listing round trip, so it can't be rate-limited and starts loading the instant the element renders. This is opt-in per place: drop a file literally named `default.<ext>` into a folder to get it. See `images/README.md`.
- **The modal's full gallery** still needs to discover however many arbitrarily-named photos exist, which a single static filename can't do — `fetchPlacePhotos()` asks the GitHub Contents API what's in the folder (sorted naturally, capped at `MAX_PHOTOS_PER_PLACE`), then builds jsDelivr CDN URLs (`jsdelivrUrl()`) for the actual bytes. Results are cached both in-memory (`photoCache`) and in `localStorage` (`PHOTO_LIST_CACHE_KEY`, 1-hour TTL — matches GitHub's rate-limit reset window) so a page reload doesn't re-spend the budget on folders already looked up. `openModal()` races this against the instant `default.*` preview above (`gallerySettled` guards whichever resolves second from clobbering the other) so the modal shows *something* immediately instead of sitting on the "photo pending" placeholder for the round trip.

`prefetchPlacePhotos()` still fires on pin/list-row hover or focus so photos are often already downloading by the time a visitor opens the modal. `.HEIC`/`.HEIF` files are deliberately excluded (`VALID_PHOTO_EXT`) since most browsers can't render them.

If the repo is forked or renamed, `GITHUB_OWNER` / `GITHUB_REPO` / `GITHUB_BRANCH` near the top of `script.js` need to be updated to match.

### Passport / stamping

`stamped` is a plain object (`placeId -> true`) persisted to `localStorage` under `STORAGE_KEY` (currently `"sancristobal_passport_v3"` — bump this key if the stamp data shape ever changes incompatibly, since old and new shapes would otherwise collide). All reads/writes go through `loadStamped()`/`saveStamped()`, which fail silently if `localStorage` is unavailable (private browsing, etc.).

### i18n

Language is a single module-level `LANG` var, not routed via URL. `setLang()` re-renders all translatable UI in place. When adding new UI text, add the key to **both** `STRINGS.en` and `STRINGS.es`, and if it's static markup in `index.html`, wire it up in `applyStaticStrings()`.

### Events tab

A third sidebar tab (alongside Places/Passport) for static, scheduled village events — festivals, patron saint day, Semana Santa, etc. Edited by hand exactly like `PLACES`: `EVENTS` (near `PLACES` in `script.js`) is empty by default; add an object with `id`, `date` (`"YYYY-MM-DD"`, sorted newest/soonest-first by `renderEvents()` via plain string comparison — the format matters), `title`/`body` (`{en, es}`, same bilingual convention as everywhere else on the site), and an optional `image` (a path like `images/events/2026-08-feria.jpg`, hand-picked rather than discovered via the GitHub API the way place photos are, since an event has at most one image and the author already knows its filename). `body` is inserted via `innerHTML` (not escaped like place `desc`) so multi-paragraph entries can use `<br><br>`, same convention as the village-story paragraphs — safe because, like the rest of the site, these are owner-authored in this file, not user-submitted. Missing/broken images are removed from the DOM via the `<img>`'s `onerror` rather than showing a broken-image icon.

(An earlier version of this tab took community-submitted reports via GitHub Issues with an owner-approval admin page — removed in favor of this simpler static-content model. If a submission workflow is ever wanted again, mind that raw user-submitted text must be escaped, not `innerHTML`'d raw like the owner-authored content below.)

## Adding photos (see `images/README.md` for the full version)

Drop image files into `images/<place-id>/` with any filename — no renaming, no code changes. Only `.jpg`/`.jpeg`/`.png`/`.webp`/`.gif` are picked up; convert HEIC first.
