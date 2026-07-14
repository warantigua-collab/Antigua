# Adding photos

No code editing needed — just drop image files into the right folder and the
site finds them automatically.

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

Inside each folder, name your photos `1`, `2`, `3` (up to 3 photos per
place, matching the 3 gallery slots in the popup card):

```
images/campanario-de-panchoy/1.jpg
images/campanario-de-panchoy/2.jpg
images/campanario-de-panchoy/3.jpg
```

## Accepted file types

`.jpg`, `.jpeg`, `.png`, or `.webp` — the site tries each extension in that
order for every slot, so you don't need to tell it which one you used.

## Partial folders are fine

Only have 1 photo for a place right now? Just add `1.jpg` and leave `2` and
`3` out — those slots will keep showing the "photo pending" placeholder
until you add more. Nothing breaks.

## Before uploading

Large phone photos can be several MB each. For a faster-loading site,
resize to roughly 1200–1600px on the longest side and export as `.jpg` at
~80% quality before dropping them in — most photo apps and Preview/Photos
apps can do this in a couple of clicks.

## GitHub Pages

If you publish this repo with GitHub Pages, this folder structure works
as-is — no build step required. Just commit and push.
