# A Million Dreams

Consulting site for [amilliondreams.llc](https://amilliondreams.llc).

**Stack:** Astro + Cloudflare Pages + Pages Function (contact form) + `amd-mailer` Worker (Gmail API)

## Dev

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # production build → dist/
npx wrangler pages dev ./dist  # test Pages Functions locally
```

## Deploy

Push to `main` — Cloudflare Pages CI builds automatically (once the GitHub integration is connected).

Or manually:

```bash
npm run build
npx wrangler pages deploy ./dist
```

## Contact form setup

Inbound mail is **Google Workspace** (MX). Do **not** enable Cloudflare Email Routing.

Outbound uses the **`amd-mailer`** Worker → **Gmail API** (OAuth refresh token for a Workspace user).

### 1. Google (one-time)
1. Cloud Console: enable **Gmail API**; OAuth consent + **Web application** client with redirect `http://localhost`.
2. Authorize as the From user (e.g. `jesse@amilliondreams.llc`) with scope `gmail.send`; save the refresh token.
3. Details: see project plan / Bitwarden item `AMD Contact Mailer (Gmail OAuth)`.

### 2. Deploy the mailer Worker

```bash
cd workers/mailer
npx wrangler secret put MAILER_SECRET --name amd-mailer
npx wrangler secret put GMAIL_CLIENT_ID --name amd-mailer
npx wrangler secret put GMAIL_CLIENT_SECRET --name amd-mailer
npx wrangler secret put GMAIL_REFRESH_TOKEN --name amd-mailer
npx wrangler deploy
```

Copy the printed `*.workers.dev` URL (no `/send`) into Pages as `MAILER_URL`.

### 3. Pages env (Production)

| Variable | Type | Description |
|----------|------|-------------|
| `PUBLIC_TURNSTILE_SITE_KEY` | Plain | Turnstile site key |
| `TURNSTILE_SECRET_KEY` | Secret | Turnstile secret key |
| `MAILER_URL` | Plain | e.g. `https://amd-mailer.<subdomain>.workers.dev` |
| `MAILER_SECRET` | Secret | Same value as Worker `MAILER_SECRET` |
| `CONTACT_TO` | Secret | `websiteinquiry@amilliondreams.llc` |
| `CONTACT_FROM` | Plain/Secret | Workspace sender, e.g. `jesse@amilliondreams.llc` (must match OAuth user) |

### 4. Turnstile + domain
Create a Turnstile widget; attach custom domain `amilliondreams.llc` in Pages if needed.

Ignore Cloudflare “missing MX” warnings for Email Routing — Workspace owns inbound MX.
