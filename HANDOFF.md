# Law Tome: automatic deploys, and the wave pages

**Goal:** the Law Tome (`conyso.com/lawtome/`) deploys itself. A merge to `main` goes live in minutes, and a daily rebuild keeps date-dependent pages right.

The first release through it is the first "wave page", the Tome's response to a viral moment:
- the Doppler Effect law page opens with an "In the news" section;
- a new page at `/lawtome/wild/plane-audio-video-location-doppler-effect/`.

The workflow is `.github/workflows/deploy-prod.yml`. It builds, runs every test and check, uploads with `rsync` (never `--delete`), and smoke-checks the live site. It stays off until the steps below are done.

## 1. Rohit, on the server (one time)

1. **Create a deploy user** (suggested name `lawtome-deploy`) that can write **only** to `$CONYSO_ROOT/lawtome/`. Nothing else on the box. For example: make that user the owner of `lawtome/`, with no sudo.
2. **Add this public key** to that user's `~/.ssh/authorized_keys`. It's the public half, so it's safe to share:

   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILe1QaHPKli6CYghlviwc/HiA4Wo7Bcf0Ajftfcis5W7 law-tome deploy (GitHub Actions)
   ```

3. **Send Krishna three things:**
   - the username;
   - the docroot path (the folder that contains `lawtome/`);
   - the output of `ssh-keyscan -t ed25519 conyso.com`.

   None of these is secret.

## 2. Krishna, on GitHub (one time)

Only the repo owner can set these:

```bash
gh secret set DEPLOY_SSH_KEY --repo krishnachagti-sudo/law-tome < ~/.ssh/lawtome_deploy
gh secret set DEPLOY_KNOWN_HOSTS --repo krishnachagti-sudo/law-tome --body "<the ssh-keyscan line Rohit sends>"
gh variable set DEPLOY_USER --repo krishnachagti-sudo/law-tome --body "<username>"
gh variable set DEPLOY_ROOT --repo krishnachagti-sudo/law-tome --body "<docroot>"
gh variable set PROD_DEPLOY_DRY_RUN --repo krishnachagti-sudo/law-tome --body true
gh variable set PROD_DEPLOY_ENABLED --repo krishnachagti-sudo/law-tome --body true
```

Then:
1. Run the workflow once from the Actions tab. It's a dry run: it lists what would change and uploads nothing.
2. If the list looks right, set `PROD_DEPLOY_DRY_RUN` to `false`.
3. Later, optionally, set `INDEXNOW_PROD` to `true` so Bing hears about changed pages.

## Check after the first real deploy

- These return 200:
  - `https://conyso.com/lawtome/wild/plane-audio-video-location-doppler-effect/`
  - `https://conyso.com/lawtome/og/wild/plane-audio-video-location-doppler-effect.png`, as `image/png`
  - `https://conyso.com/lawtome/assets/wave.css`, as `text/css`
  - `https://conyso.com/lawtome/1fad8697495a79c8bc03db90a16f1d52.txt`, the IndexNow key file
- The Doppler Effect law page shows "In the news" as section 01.
- On the wild page, tapping "The 300 m pass" reveals a curve.

## Fallback: manual upload (same as conyso HANDOFF.md section 0B)

If the automation isn't ready and something has to go live:

```bash
git fetch && git checkout main
cd lawtome && npm ci && npm run build    # ends "built { pages: 1117 ... }"
rsync -az --itemize-changes --dry-run dist/ "$CONYSO_USER@conyso.com:$CONYSO_ROOT/lawtome/"
rsync -az --itemize-changes dist/ "$CONYSO_USER@conyso.com:$CONYSO_ROOT/lawtome/"
```

**Never use `--delete`.**
