# San Cristóbal El Alto — Treasure Map

An interactive, illustrated "treasure map" of San Cristóbal El Alto (Antigua,
Guatemala), tracing the real shape of the village's roads with pins for
viewpoints, restaurants, lodging, wellness spots, and landmarks. Visitors can
search, filter by category, read details on each place — including a photo
gallery with a full-size lightbox viewer (arrow keys / prev-next buttons) —
and stamp a digital passport as they visit — all saved locally in the
browser, no account or backend required.

## Running it

No build step, no dependencies, no server required.

- **Locally:** just open `index.html` in any modern browser (Chrome,
  Safari, Firefox, Edge).
- **GitHub Pages:** push this repo and enable Pages on the `main` branch,
  root folder. `index.html` is already at the repo root, so it'll work
  as-is.

## Project structure

```
index.html           markup only, links to style.css and script.js
style.css             all styling
script.js             all logic — data, rendering, search/filter, passport
images/
  README.md          how to add photos (drop-in folders, no code editing)
  <place-id>/         one folder per map location
    (any image files)  auto-detected via the GitHub API, no renaming needed
```

## Adding or editing places

Everything about each pin — name, category, position, description — lives
in the `PLACES` array near the top of `script.js`. Each place has:

- `id` — must match its `images/<id>/` folder name if you want photos to
  show up
- `name` — displayed as-is in both languages (proper nouns aren't translated)
- `cats` — an array, since a place can belong to more than one category
  (e.g. a spot that's both a restaurant and a shop)
- `x` / `y` — position on the map as a percentage of the canvas
- `desc` — an `{ en, es }` object with the description in both languages

## Adding photos

See [`images/README.md`](images/README.md) — no code editing needed and no
renaming required, just drop image files into the matching folder with
whatever filename they already have. Photos are served through jsDelivr's
CDN for speed; see that file for details.

## Language

The site defaults to English and includes a full Spanish translation,
toggled with the EN/ES switch in the header. All interface strings live in
the `STRINGS` object near the top of `script.js`.

## Passport / stamps

Visited places are tracked in the browser's `localStorage` — nothing is
sent anywhere, and progress is per-device/per-browser. There's a "Reset
passport" button in the Passport tab for starting over.

## Known limitations

- The map is a hand-traced illustration based on reference screenshots, not
  a GPS-accurate survey — some positions (noted in the map caption) are
  estimated.
- Photo galleries show up to 6 images per place, fetched live from GitHub —
  photos won't appear when opening index.html locally without hosting, and
  .HEIC/.HEIF photos need converting to .jpg first (see images/README.md).
