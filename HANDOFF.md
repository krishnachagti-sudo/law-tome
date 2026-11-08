# Law Tome: deploy of 2026-11-09 (wave pages)

**What this is:** the first "wave page", the Tome's response to a viral moment. Two parts:
- **The takeover:** the Doppler Effect law page now opens with an "In the news" section.
- **A new page:** `/lawtome/wild/plane-audio-video-location-doppler-effect/`.

**Branch:** `wave/2026-11-doppler-capture`. It contains everything in `release/2026-10-30` for the Law Tome, so if the Oct 30 Law Tome upload hasn't happened yet, this upload covers it.

## Deploy (same steps as conyso HANDOFF.md section 0B)

```bash
git fetch && git checkout wave/2026-11-doppler-capture
cd lawtome && npm ci && npm run build    # about 10 minutes, ends "built { pages: 1117 ... }"
rsync -az --itemize-changes --dry-run dist/ "$CONYSO_USER@conyso.com:$CONYSO_ROOT/lawtome/"   # read the list
rsync -az --itemize-changes dist/ "$CONYSO_USER@conyso.com:$CONYSO_ROOT/lawtome/"
```

**Never use `--delete`.** Law Tome URLs are permanent, and a bad build must not be able to remove live pages.

`site.config.json` already sets origin `https://conyso.com` and base `/lawtome/`.

**New on the server:**
- `/lawtome/wild/plane-audio-video-location-doppler-effect/index.html`
- `/lawtome/og/wild/plane-audio-video-location-doppler-effect.png` and `...-16x9.png`
- `/lawtome/assets/wave.css`

## Check after upload

- These return 200:
  - `curl -sI https://conyso.com/lawtome/wild/plane-audio-video-location-doppler-effect/`
  - the two `og/wild/*.png` images, as `image/png`
  - `assets/wave.css`, as `text/css`
- `https://conyso.com/lawtome/laws/the-doppler-effect/` shows **"In the news"** as section 01, above "In plain English".
- On the wild page, tapping "The 300 m pass" reveals a curve, and the slider redraws it.
- Then tell Krishna the date and time it went live. Measurement is dated from it.

## Good to know

- **The takeover is baked in at build time.** It's on while the build date is on or before 2026-11-23. After that, one rebuild and upload removes it. Until deploys are automatic, that needs a manual run after the 23rd.

## Next, if you have time: automatic deploys

So pages go live on merge instead of by hand:
1. Create a deploy user on the box that can write only to `$CONYSO_ROOT/lawtome/`.
2. Add the public key Krishna sends you.
3. Send back the host key line: `ssh-keyscan -t ed25519 conyso.com`.

Krishna sets the repo secrets himself; collaborators can't.
