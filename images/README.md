# Adding photos

No renaming, no code editing — just drop image files into the right
folder and the site finds them automatically, whatever they're named.

## Where to put photos

Each place has its own folder, named to match its id on the map:

```
images/
  cerro-san-cristobal/
  restaurante-antigua-magica/
  vertigo-antigua/
  la-pilita/
  plaza-san-cristobal-alto/
  casa-san-sebastian/
  tienda-abuelitos/
  el-temascal/
  la-pilona/
  tierra-y-lava/
  sky-dancer-villa/
  campanario-de-panchoy/
```

Drop your photos straight into the matching folder, keeping whatever
filename your phone or camera gave them — `IMG_4821.jpg`,
`Cerro San Cristobal_1.png`, anything is fine. The site asks GitHub what's
actually in each folder when the page loads and displays whatever it finds,
up to 6 photos per place, in filename order.

## Accepted file types

`.jpg`, `.jpeg`, `.png`, `.webp`, or `.gif`.

**Not supported: `.HEIC` / `.HEIF`** (the default format on newer
iPhones) — most browsers can't display these directly, so the site skips
them. Convert to `.jpg` before adding:
- **iPhone/Mac:** open the photo in the **Photos** app → **File → Export** (Mac)
  or **Share → Options → keep as JPEG** when sending it off the phone
- **Any platform:** free converters like cloudconvert.com/heic-to-jpg
  work in a browser, no install needed

## Partial folders are fine

Only have 1 photo for a place right now? Just add that one — the rest of
the gallery keeps showing the "photo pending" placeholder until more show
up. Nothing breaks either way.

## Speed up the map's place list: add a "default" photo

The map view's place list shows a small thumbnail next to each place.
That thumbnail doesn't ask GitHub what's in the folder — it just tries to
load a file named exactly **`default`** (`default.jpg`, `default.png`,
etc.) directly. If one exists, it shows up basically instantly; if not,
the list falls back to a plain colored icon for that place, which is
also fine.

This is optional but recommended: pick your best photo of a place, save
a copy of it as `default.jpg` (reusing an existing photo's content under
a new filename is fine) in that place's folder alongside the rest. The
full photo gallery inside a place's popup still shows every photo in the
folder as usual, `default.jpg` included.

## How this works technically

Besides the `default.<ext>` fast path above, the full gallery shown when
you open a place still calls the GitHub API (`api.github.com`) at load
time to list the contents of each `images/<place-id>/` folder and
renders whatever image files it finds. This means:

- It only works once the site is actually hosted on GitHub Pages (or
  anywhere that can reach `api.github.com`) — opening `index.html` directly
  from your own computer won't show photos, since there's no repo to ask.
- If you fork this repo or rename it, update `GITHUB_OWNER` / `GITHUB_REPO`
  / `GITHUB_BRANCH` near the top of `script.js` to match.
- GitHub's unauthenticated API allows only 60 requests per hour per
  visitor IP — easy to hit if a folder is checked on every single page
  load. Full listings are cached in `localStorage` for an hour so repeat
  visits don't re-spend that budget, and the `default.<ext>` fast path
  above doesn't call this API at all, which is the main reason to add one.

## GitHub Pages

If you publish this repo with GitHub Pages, this folder structure works
as-is — no build step required. Just commit and push.
