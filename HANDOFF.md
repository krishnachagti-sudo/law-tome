# Law Tome: automatic deploys, and the wave pages

**Goal:** the Law Tome (`conyso.com/lawtome/`) deploys itself. A merge to `main` goes live in minutes, and a daily rebuild keeps date-dependent pages right.

The first release through it is the first "wave page", the Tome's response to a viral moment:
- the Doppler Effect law page opens with an "In the news" section;
- a new page at `/lawtome/wild/plane-audio-video-location-doppler-effect/`.

The workflow is `.github/workflows/deploy-prod.yml`. It builds, runs every test and check, uploads with `rsync` (never `--delete`), and smoke-checks the live site. It stays off until the steps below are done.

## Two things changed since this was first written

- **conyso.com is behind Cloudflare now** (nameservers moved 11 Nov). Cloudflare's proxy doesn't carry SSH, so the deploy connects to the **server's own IP address**, not to conyso.com.
- **The server is managed in Cloudways,** and Rohit doesn't have panel access, so the server step is with **Kamaldeep**.

## 1. Kamaldeep, in Cloudways (one time)

1. **Create a login limited to the Law Tome's folder.** Cloudways application credentials do this: SFTP/SSH access to one application only.
   - It must be able to write to the folder that contains `lawtome/`.
   - It must not have master or root access.
2. **Attach this public key** to that login. It's the public half, so it's safe to share:

   ```
   ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAILe1QaHPKli6CYghlviwc/HiA4Wo7Bcf0Ajftfcis5W7 law-tome deploy (GitHub Actions)
   ```

   If Cloudways won't take a key on an application login, tell Krishna before creating anything else.
3. **Send Krishna five things.** None of them is secret:
   - the server's public IP address (from Cloudways, not a DNS lookup of conyso.com, which now returns Cloudflare's IPs);
   - the SSH port;
   - the username;
   - the full path of the folder that contains `lawtome/` (Cloudways paths usually look like `/home/master/applications/<app>/public_html`);
   - the output of `ssh-keyscan -t ed25519 <server IP>`.

## 2. Krishna, on GitHub (one time)

Only the repo owner can set these:

```bash
gh secret set DEPLOY_SSH_KEY --repo krishnachagti-sudo/law-tome < ~/.ssh/lawtome_deploy
gh secret set DEPLOY_KNOWN_HOSTS --repo krishnachagti-sudo/law-tome --body "<the ssh-keyscan line>"
gh variable set DEPLOY_HOST --repo krishnachagti-sudo/law-tome --body "<server IP>"
gh variable set DEPLOY_PORT --repo krishnachagti-sudo/law-tome --body "<SSH port>"
gh variable set DEPLOY_USER --repo krishnachagti-sudo/law-tome --body "<username>"
gh variable set DEPLOY_ROOT --repo krishnachagti-sudo/law-tome --body "<folder that contains lawtome/>"
gh variable set PROD_DEPLOY_DRY_RUN --repo krishnachagti-sudo/law-tome --body true
gh variable set PROD_DEPLOY_ENABLED --repo krishnachagti-sudo/law-tome --body true
```

**Optional, recommended now that Cloudflare caches the site.** So readers see new pages straight away:
1. Create a Cloudflare API token with only "Zone · Cache Purge" on conyso.com.
2. Set it and the zone ID:

```bash
gh secret set CF_API_TOKEN --repo krishnachagti-sudo/law-tome
gh variable set CF_ZONE_ID --repo krishnachagti-sudo/law-tome --body "<zone ID from the Cloudflare overview page>"
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

Use the server IP, not conyso.com: Cloudflare doesn't carry SSH.

If the automation isn't ready and something has to go live:

```bash
git fetch && git checkout main
cd lawtome && npm ci && npm run build    # ends "built { pages: 1117 ... }"
rsync -az --itemize-changes --dry-run dist/ "$CONYSO_USER@<server IP>:$CONYSO_ROOT/lawtome/"
rsync -az --itemize-changes dist/ "$CONYSO_USER@<server IP>:$CONYSO_ROOT/lawtome/"
```

**Never use `--delete`.**
