# Sumit Dabral — Portfolio

A standalone, dark-cinematic portfolio site. Plain HTML/CSS/JS — no build step.

## Run locally

Any static server works, e.g.:

```bash
python -m http.server 8971      # then open http://localhost:8971
# or
npx serve .
```

## Deploy

Drag this folder onto **Netlify**, or push it and point **Vercel** / **GitHub Pages**
at it. It's fully static; no server or environment variables needed.

## How media works (hybrid)

- **Images / 3D renders** are downloaded into `assets/img` and served locally.
- **Videos stream from Google Drive** via the iframe player — nothing to host. Each
  video tile is backed by a local poster frame in `assets/poster` (also the fallback
  if a video ever becomes unavailable).

> ⚠️ Because videos stream from Drive, the source folder must stay **shared / "anyone
> with the link"**. If it's made private, video playback stops (posters still show).

To re-pull or refresh the local images/posters:

```bash
node scripts/fetch-assets.mjs   # skips files that already exist
```

## Editing content

All work items and the section filters live in **`data.js`**. Add, reorder, retitle, or
remove entries there — the gallery renders from it. Bio, experience, skills, and contact
copy are plain HTML in **`index.html`**.

## Please confirm before publishing

- **LinkedIn URL** — `index.html` links to `https://www.linkedin.com/in/sumit-dabral`
  as a placeholder (the CV only lists "LinkedIn.com/Sumit"). Update the `href` on the
  LinkedIn contact card to the real profile.
- **Video titles** — the 12 short-form edits are auto-titled "Short-Form Edit 01–12".
  Rename any in `data.js` if you'd prefer descriptive titles.
