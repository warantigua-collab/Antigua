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
  el-temazcal/
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

## How this works technically

The site calls the GitHub API (`api.github.com`) at load time to list the
contents of each `images/<place-id>/` folder and renders whatever image
files it finds. This means:

- It only works once the site is actually hosted on GitHub Pages (or
  anywhere that can reach `api.github.com`) — opening `index.html` directly
  from your own computer won't show photos, since there's no repo to ask.
- If you fork this repo or rename it, update `GITHUB_OWNER` / `GITHUB_REPO`
  / `GITHUB_BRANCH` near the top of `script.js` to match.
- The GitHub API allows a modest number of unauthenticated requests per
  hour per visitor — plenty for normal traffic on a small site, but worth
  knowing if it ever stops finding photos temporarily under heavy load.

## GitHub Pages

If you publish this repo with GitHub Pages, this folder structure works
as-is — no build step required. Just commit and push.
