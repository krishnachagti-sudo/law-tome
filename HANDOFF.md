# Law Tome: automatic deploys, and the wave pages

**Goal:** the Law Tome (`conyso.com/lawtome/`) deploys itself. A merge to `main` goes live in minutes, and a daily rebuild keeps date-dependent pages right.

The first release through it is the first "wave page", the Tome's response to a viral moment:
- the Doppler Effect law page opens with an "In the news" section;
- a new page at `/lawtome/wild/plane-audio-video-location-doppler-effect/`.

The workflow is `.github/workflows/deploy-prod.yml`. It builds, runs every test and check, uploads with `rsync` (never `--delete`), and smoke-checks the live site. It stays off until the steps below are done.

## Two things changed since this was first written

- **conyso.com is behind Cloudflare now** (nameservers moved 11 Nov). Cloudflare's proxy doesn't carry SSH, so the deploy connects to the **server's own IP address**, not to conyso.com.
- **The server is managed in Cloudways,** and Rohit doesn't have panel access, so the server step is with **Kamaldeep**.

## 1. Kamaldeep, in Cloudways: mostly done (13 Nov)

- **Done:** an application-level login, `lawtome-deploy`, on the conyso.com app, with no master access.
- **Server:** `162.243.170.201`, port `22`.
- **Host key:** the `ssh-keyscan -t ed25519 162.243.170.201` line is in the Google Chat thread with Kamaldeep. It isn't secret.
- **Deploy key:** Cloudways rejected the ed25519 key ("use 1024 bits or higher RSA/DSA"), so the deploy key is now **RSA 4096**: `~/.ssh/lawtome_deploy_rsa` on Krishna's Mac. Its public half, sent to Kamaldeep, is:

  ```
  ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQDNo6V7kOWgMiIh5C7s2ARB8ofFhdb4fzB2WBiCbVi6ESNoDc62CGTvJK6TI7milYCqqewZ+PH3Yu6uKiXOFzs9AS6eHyw34QhBOaT5cHKpGUpIsI1U4FKGa7GUhg0ZPkYggPgVDK/4ykS0MzSL2re2q/oulr4pTelLJv0kmZucDLStZVqey5znD19pIw5XN8n6JC1Hs8/6wW3gZdUaj/KssweoQ+Dt2yLk5bH8A3ljdXciSbwf4b8WpQ5sprFma72sJCf9ikhf9ndDGcfGKi43cZkt7NJsJs3Pfjl0mMyC+cBIJ81GzK3mdWsP2O+3F39OqgHP7F8w9FNkLt4oz1qsC3FiorDEuu/qNV1MiLKhiwMbHIAzHziVBnm4RXmv+Jjr0ImeRk8HqJ2cvnB18C5TQjQUze1meLL6fo3tsKl2Za4aUr8R9Z8vmvw2CY+PnuhMkHKTDWoHgsApQ28yksDmlrNLFfSOiL/Ou8+Q8mSzjHZmT3LDLSp6Mefge+eIDz8Xcq8jnj+23ZkNEcAOd/ab+auAcEgxMTh7efCFJWTcfePg6PV/vwd6j1Cu0v1jDsduc1995TfJXIGgLkPx0JBxvDNqU3m6Reuo5eps5VHC6jNMLZp8duoY3vRqOIiBDsH9B4oquJv4m7Jj75GSfH3WL6gN3VmJ4J3+5Cz2BfBb7Q== law-tome deploy (GitHub Actions)
  ```

  The old ed25519 key (`~/.ssh/lawtome_deploy`) isn't used.
- **Still to come from Kamaldeep:** the full path of the folder that contains `lawtome/`, usually `/home/master/applications/<app>/public_html` on Cloudways.

## 2. Krishna, on GitHub (one time)

Only the repo owner can set these:

```bash
gh secret set DEPLOY_SSH_KEY --repo krishnachagti-sudo/law-tome < ~/.ssh/lawtome_deploy_rsa
gh secret set DEPLOY_KNOWN_HOSTS --repo krishnachagti-sudo/law-tome --body "<the ssh-keyscan line from the chat, starting 162.243.170.201 ssh-ed25519>"
gh variable set DEPLOY_HOST --repo krishnachagti-sudo/law-tome --body "162.243.170.201"
gh variable set DEPLOY_PORT --repo krishnachagti-sudo/law-tome --body "22"
gh variable set DEPLOY_USER --repo krishnachagti-sudo/law-tome --body "lawtome-deploy"
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
